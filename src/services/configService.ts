import * as vscode from 'vscode';
import { AIProviderId, CommitAIConfig, CommitLanguage, CommitStyle, DiffMode } from '../types';

export class ConfigService {
  getConfig(): CommitAIConfig {
    const config = vscode.workspace.getConfiguration('commitAI');

    return {
      language: config.get<CommitLanguage>('language', 'zh-CN'),
      style: config.get<CommitStyle>('style', 'emojiConventional'),
      provider: config.get<AIProviderId>('provider', 'openai'),
      model: config.get<string>('model', 'gpt-4o-mini'),
      maxDiffLength: config.get<number>('maxDiffLength', 12000),
      diffMode: config.get<DiffMode>('diffMode', 'auto'),
      showPreview: config.get<boolean>('showPreview', false),
      apiBaseUrl: config.get<string>('apiBaseUrl', '').trim()
    };
  }

  async updateLanguage(language: CommitLanguage): Promise<void> {
    await vscode.workspace.getConfiguration('commitAI').update('language', language, vscode.ConfigurationTarget.Global);
  }

  async updateStyle(style: CommitStyle): Promise<void> {
    await vscode.workspace.getConfiguration('commitAI').update('style', style, vscode.ConfigurationTarget.Global);
  }
}
