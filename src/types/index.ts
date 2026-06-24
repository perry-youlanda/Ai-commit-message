export type CommitLanguage = 'zh-CN' | 'en-US' | 'bilingual';

export type CommitStyle = 'simple' | 'conventional' | 'detailed' | 'emojiConventional';

export type DiffMode = 'auto' | 'staged' | 'unstaged' | 'all';

export type AIProviderId = 'openai' | 'deepseek' | 'qwen' | 'ollama' | 'custom';

export interface CommitAIConfig {
  language: CommitLanguage;
  style: CommitStyle;
  provider: AIProviderId;
  model: string;
  maxDiffLength: number;
  diffMode: DiffMode;
  showPreview: boolean;
  apiBaseUrl: string;
}

export interface GitChanges {
  root: string;
  branch: string;
  files: string;
  stats: string;
  diff: string;
  source: 'staged' | 'unstaged' | 'all';
  whitespaceOnly: boolean;
  truncated: boolean;
  originalDiffLength: number;
}

export interface BuildCommitPromptInput {
  diff: string;
  files: string;
  stats: string;
  language: CommitLanguage;
  style: CommitStyle;
}

export interface GitRepositoryLike {
  rootUri?: import('vscode').Uri;
  inputBox: {
    value: string;
  };
}
