export type RepositorySummary = {
  text?: string;
  ai_generated?: boolean;
  generation_method?: string;
  generated_at?: string;
  model_used?: string;
  tokens_used?: number;
  confidence_score?: number;
  [key: string]: unknown;
};

export type RepositoryTechStackDependency = {
  name?: string;
  current_version?: string | null;
  latest_version?: string | null;
  ecosystem?: string | null;
  versions_behind?: number | null;
  is_outdated?: boolean | null;
  status?: string | null;
};

export type RepositoryTechStack = {
  repository_name?: string;
  languages?: Record<string, number>;
  frameworks?: string[];
  dependencies?: RepositoryTechStackDependency[];
  version_info?: Record<string, unknown>;
  dependency_file_type?: string | null;
  currency_score?: number | null;
  outdated_count?: number | null;
  total_dependencies?: number | null;
  primary_language?: string | null;
  language_diversity?: number | null;
  outdated_percentage?: number | null;
  [key: string]: unknown;
};

export type RepositoryCommitHistory = {
  repository_name?: string;
  total_commits?: number;
  recent_90d?: number;
  recent_180d?: number;
  recent_365d?: number;
  last_commit_date?: string;
  patterns?: string[];
  commit_frequency?: number;
  consistency_score?: number;
  activity_rate?: number;
  days_since_last_commit?: number;
  first_commit_date?: string;
  [key: string]: unknown;
};

export type Repository = {
  name: string;
  description?: string | null;
  url: string;
  stars?: number;
  forks?: number;
  watchers?: number;
  language?: string | null;
  languages?: Record<string, number>;
  language_stats?: Record<string, number>;
  language_count?: number;
  updated_at?: string;
  pushed_at?: string;
  created_at?: string;
  last_commit_date?: string;
  first_commit_date?: string;
  total_commits?: number;
  recent_commits_90d?: number;
  commit_history?: RepositoryCommitHistory | null;
  commit_metrics?: Record<string, unknown> | null;
  commit_velocity?: number | null;
  avg_commit_size?: number | null;
  largest_commit?: number | null;
  smallest_commit?: number | null;
  summary?: RepositorySummary | null;
  ai_summary?: string | null;
  tech_stack?: RepositoryTechStack | null;
  composite_score?: number | null;
  rank?: number | null;
  age_days?: number | null;
  days_since_last_push?: number | null;
  size_kb?: number | null;
  is_fork?: boolean;
  is_private?: boolean;
  has_readme?: boolean;
  [key: string]: unknown;
};

export type RepositoryStatsPayload = {
  repositories: Repository[];
  metadata?: Record<string, unknown>;
  profile?: Record<string, unknown>;
};
