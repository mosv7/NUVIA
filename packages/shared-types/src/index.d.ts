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
  request_id?: string;
  message?: string;
  code?: string;
  error?: { code: string; message: string; details?: { field: string; reason: string }[] };
  errors?: { field: string; message: string }[];
}

export type AiOperation = 'analyze' | 'summaries' | 'reports' | 'survey-suggestions' | 'answers';
export type AiSentiment = 'positive' | 'negative' | 'neutral' | 'mixed';
export interface AiEvidence {
  id: string;
  text: string;
}
export interface AiCapability {
  ready: boolean;
  reason: string | null;
  models: string[];
  profile: string;
}
export interface AiCapabilities {
  schema_version: '1';
  capabilities: Record<AiOperation, AiCapability>;
}
export interface AiMention {
  id: string;
  text: string;
  start: number;
  end: number;
  sentiment: Exclude<AiSentiment, 'mixed'>;
  score: number;
  extraction_score: number;
  accepted: boolean;
}
export interface AiAnalysis {
  id: string;
  sentiment: AiSentiment | null;
  reason: 'insufficient_evidence' | null;
  method: 'aspect_derived';
  coverage: 'partial_aspects';
  mentions: AiMention[];
  contributing_ids: string[];
  excluded_count: number;
}
