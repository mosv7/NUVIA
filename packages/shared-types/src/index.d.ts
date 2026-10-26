export const API_PREFIX: '/api';
export const SUPPORTED_LOCALES: readonly ['ar', 'en'];
export type Locale = 'ar' | 'en';

export interface UserView {
  id: string;
  name: string;
  email: string;
  locale: Locale;
  emailVerificationAvailable: false;
}

export interface BranchView {
  id: string;
  name: string;
  archivedAt: string | null;
  isPrimary: boolean;
  country?: string;
  city?: string;
  address?: string;
}

export interface WorkspaceView {
  id: string;
  businessName: string;
  industry: string;
  locale: Locale;
  reportingTimezone: string;
  branchType: 'single' | 'multiple' | null;
  primaryBranchId: string | null;
  onboardingStep: 'branches' | 'welcome' | 'complete';
  branches: BranchView[];
}

export interface SessionView {
  user: UserView | null;
  workspace: WorkspaceView | null;
  csrfToken: string;
}

export interface ApiErrorBody {
  message?: string;
  code?: string;
  error?: { code: string; message: string; details?: { field: string; reason: string }[] };
  errors?: { field: string; message: string }[];
}
