import { OpenAICompatibleProvider } from './openaiCompatibleProvider';

export class OpenAIProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string, baseUrl = 'https://api.openai.com/v1') {
    super(apiKey, model, baseUrl, 'OpenAI');
  }
}
