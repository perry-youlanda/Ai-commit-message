import { OpenAICompatibleProvider } from './openaiCompatibleProvider';

export class DeepSeekProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string, baseUrl = 'https://api.deepseek.com') {
    super(apiKey, model, baseUrl, 'DeepSeek');
  }
}
