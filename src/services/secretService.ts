import * as vscode from 'vscode';
import { AIProviderId } from '../types';

const API_KEY_PREFIX = 'commitAI.apiKey';

export class SecretService {
  constructor(private readonly secrets: vscode.SecretStorage) {}

  getApiKey(provider: AIProviderId): Thenable<string | undefined> {
    return this.secrets.get(this.getApiKeyName(provider));
  }

  storeApiKey(provider: AIProviderId, apiKey: string): Thenable<void> {
    return this.secrets.store(this.getApiKeyName(provider), apiKey);
  }

  deleteApiKey(provider: AIProviderId): Thenable<void> {
    return this.secrets.delete(this.getApiKeyName(provider));
  }

  getOpenAIApiKey(): Thenable<string | undefined> {
    return this.getApiKey('openai');
  }

  storeOpenAIApiKey(apiKey: string): Thenable<void> {
    return this.storeApiKey('openai', apiKey);
  }

  deleteOpenAIApiKey(): Thenable<void> {
    return this.deleteApiKey('openai');
  }

  async hasApiKey(provider: AIProviderId): Promise<boolean> {
    return Boolean(await this.getApiKey(provider));
  }

  private getApiKeyName(provider: AIProviderId): string {
    return `${API_KEY_PREFIX}.${provider}`;
  }
}
