import { CommitAIConfig } from '../types';
import { AIProvider } from './aiProvider';
import { CustomProvider } from './customProvider';
import { DeepSeekProvider } from './deepseekProvider';
import { OllamaProvider } from './ollamaProvider';
import { OpenAIProvider } from './openaiProvider';
import { QwenProvider } from './qwenProvider';

const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  deepseek: 'deepseek-chat',
  qwen: 'qwen-plus',
  ollama: 'llama3.1',
  custom: 'gpt-4o-mini'
} as const;

export function providerNeedsApiKey(config: CommitAIConfig): boolean {
  return config.provider !== 'ollama';
}

export function createProvider(config: CommitAIConfig, apiKey?: string): AIProvider {
  const model = getEffectiveModel(config);
  const baseUrl = config.apiBaseUrl;

  if (config.provider === 'ollama') {
    return new OllamaProvider(model, baseUrl || undefined);
  }

  if (!apiKey) {
    throw new Error(`请先运行 “Commit AI: Set API Key” 配置 ${config.provider} API Key。`);
  }

  if (config.provider === 'deepseek') {
    return new DeepSeekProvider(apiKey, model, baseUrl || undefined);
  }

  if (config.provider === 'qwen') {
    return new QwenProvider(apiKey, model, baseUrl || undefined);
  }

  if (config.provider === 'custom') {
    if (!baseUrl) {
      throw new Error('使用 custom provider 时请先配置 commitAI.apiBaseUrl。');
    }
    return new CustomProvider(apiKey, model, baseUrl);
  }

  return new OpenAIProvider(apiKey, model, baseUrl || undefined);
}

function getEffectiveModel(config: CommitAIConfig): string {
  if (config.model && config.model !== DEFAULT_MODELS.openai) {
    return config.model;
  }

  return DEFAULT_MODELS[config.provider];
}
