import { OpenAICompatibleProvider } from './openaiCompatibleProvider';

export class QwenProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string, baseUrl = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1') {
    super(apiKey, model, baseUrl, 'Qwen');
  }
}
