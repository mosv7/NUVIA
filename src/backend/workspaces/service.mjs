import { randomUUID } from 'node:crypto';
import { ApiError } from '../http/errors.mjs';
import { transaction } from '../database.mjs';
const normalized = (name) => name.normalize('NFKC').trim().toLowerCase();
const branchView = (branch, primaryId) => ({
  id: branch._id,
  name: branch.name,
  archivedAt: branch.archivedAt?.toISOString() ?? null,
  isPrimary: branch._id === primaryId,
});
async function owned(userId, id, deps, session) {
  const workspace = await deps.models.Workspace.findOne(
    { ownerUserId: userId, ...(id ? { _id: id } : {}) },
    null,
    { session },
  ).lean();
  if (!workspace) throw new ApiError(404, 'NOT_FOUND');
  return workspace;
}
export async function getWorkspace(userId, deps) {
  const w = await owned(userId, null, deps);
  const branches = await deps.models.Branch.find({ workspaceId: w._id, archivedAt: null })
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  return {
    id: w._id,
    businessName: w.name,
    industry: w.industry,
    locale: w.locale,
    reportingTimezone: w.reportingTimezone,
    branchType: w.branchMode,
    primaryBranchId: w.primaryBranchId,
    onboardingStep: w.onboardingStep,
    branches: branches.map((b) => branchView(b, w.primaryBranchId)),
  };
}
export async function saveWorkspace(userId, input, deps) {
  const update = {
    name: input.businessName,
    industry: input.industry,
    locale: input.locale,
    reportingTimezone: input.reportingTimezone,
    updatedAt: deps.now(),
  };
  const create = {
    _id: randomUUID(),
    ownerUserId: userId,
    branchMode: 'multiple',
    primaryBranchId: null,
    onboardingStep: 'branches',
    createdAt: deps.now(),
    version: 1,
  };
  try {
    await deps.models.Workspace.updateOne(
      { ownerUserId: userId },
      { $set: update, $setOnInsert: create },
      { upsert: true },
    );
  } catch (e) {
    if (e.code !== 11000) throw e;
    await deps.models.Workspace.updateOne({ ownerUserId: userId }, { $set: update });
  }
  return getWorkspace(userId, deps);
}
async function mutateWorkspace(userId, workspaceId, deps, action) {
  try {
    return await transaction(deps, async (session) => {
      const workspace = await owned(userId, workspaceId, deps, session);
      await deps.models.Workspace.updateOne(
        { _id: workspace._id, ownerUserId: userId },
        { $inc: { version: 1 }, $set: { updatedAt: deps.now() } },
        { session },
      );
      return action(workspace, session);
    });
  } catch (e) {
    if (e.code === 11000) throw new ApiError(409, 'BRANCH_NAME_USED');
    throw e;
  }
}
export async function completeSetup(userId, input, deps) {
  await mutateWorkspace(userId, null, deps, async (w, session) => {
    const branches = deps.models.Branch;
    if (
      input.branchType === 'single' &&
      (await branches.countDocuments(
        { workspaceId: w._id, archivedAt: null, _id: { $ne: w.primaryBranchId } },
        { session },
      ))
    )
      throw new ApiError(409, 'ACTIVE_BRANCHES_EXIST');
    const id = w.primaryBranchId || randomUUID(),
      branchName = input.branchType === 'multiple' ? input.branchName : w.name;
    if (!branchName?.trim()) throw new ApiError(422, 'BRANCH_NAME_REQUIRED');
    await branches.updateOne(
      { _id: id, workspaceId: w._id },
      {
        $set: {
          name: branchName,
          normalizedName: normalized(branchName),
          updatedAt: deps.now(),
          archivedAt: null,
        },
        $setOnInsert: { createdAt: deps.now() },
      },
      { upsert: true, session },
    );
    await deps.models.Workspace.updateOne(
      { _id: w._id, ownerUserId: userId },
      { $set: { branchMode: input.branchType, primaryBranchId: id, onboardingStep: 'complete' } },
      { session },
    );
  });
  return getWorkspace(userId, deps);
}
export async function listBranches(userId, workspaceId, { includeArchived = false }, deps) {
  const w = await owned(userId, workspaceId, deps);
  const items = await deps.models.Branch.find({
    workspaceId,
    ...(includeArchived ? {} : { archivedAt: null }),
  })
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  return items.map((b) => branchView(b, w.primaryBranchId));
}
export async function createBranch(userId, workspaceId, { name }, deps) {
  return mutateWorkspace(userId, workspaceId, deps, async (w, session) => {
    if (w.onboardingStep !== 'complete' || w.branchMode !== 'multiple')
      throw new ApiError(409, 'MULTIPLE_BRANCHES_REQUIRED');
    const branch = {
      _id: randomUUID(),
      workspaceId,
      name,
      normalizedName: normalized(name),
      archivedAt: null,
      createdAt: deps.now(),
      updatedAt: deps.now(),
    };
    await deps.models.Branch.insertOne(branch, { session });
    return branchView(branch, w.primaryBranchId);
  });
}
export async function updateBranch(userId, workspaceId, branchId, input, deps) {
  return mutateWorkspace(userId, workspaceId, deps, async (w, session) => {
    const branches = deps.models.Branch;
    const branch = await branches.findOne({ _id: branchId, workspaceId }, null, { session }).lean();
    if (!branch) throw new ApiError(404, 'NOT_FOUND');
    if (input.archived && branchId === w.primaryBranchId)
      throw new ApiError(409, 'PRIMARY_BRANCH_REQUIRED');
    if (input.isPrimary && (input.archived || (branch.archivedAt && input.archived !== false)))
      throw new ApiError(409, 'ACTIVE_BRANCH_REQUIRED');
    if (input.archived === false && branch.archivedAt && w.branchMode === 'single')
      throw new ApiError(409, 'MULTIPLE_BRANCHES_REQUIRED');
    const update = { updatedAt: deps.now() };
    if (input.name !== undefined)
      Object.assign(update, { name: input.name, normalizedName: normalized(input.name) });
    if (input.archived !== undefined) update.archivedAt = input.archived ? deps.now() : null;
    await branches.updateOne({ _id: branchId, workspaceId }, { $set: update }, { session });
    if (input.isPrimary)
      await deps.models.Workspace.updateOne(
        { _id: workspaceId, ownerUserId: userId },
        { $set: { primaryBranchId: branchId } },
        { session },
      );
    return branchView({ ...branch, ...update }, input.isPrimary ? branchId : w.primaryBranchId);
  });
}
