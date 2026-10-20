export const API_PREFIX: '/api/v1';
export const SUPPORTED_LOCALES: readonly ['ar', 'en'];
export type Locale = 'ar' | 'en';

export interface UserView {
  id: string;
  name: string;
  email: string;
  locale: Locale;
  emailVerified: boolean;
}

export interface BranchView {
  id: string;
  name: string;
  archivedAt: string | null;
  isPrimary: boolean;
}

export interface WorkspaceView {
  id: string;
  businessName: string;
  industry: string;
  locale: Locale;
  reportingTimezone: string;
  branchType: 'single' | 'multiple';
  primaryBranchId: string | null;
  onboardingStep: 'branches' | 'complete';
  branches: BranchView[];
}

export interface SessionView {
  user: UserView | null;
  workspace: WorkspaceView | null;
  csrfToken: string;
}

export interface ApiErrorBody {
  error: { code: string; message: string; details: { field: string; reason: string }[] };
  request_id: string;
}
