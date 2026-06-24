import { OpenAICompatibleProvider } from './openaiCompatibleProvider';

export class CustomProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string, baseUrl: string) {
    super(apiKey, model, baseUrl, 'Custom provider');
  }
}
