import { AIProvider } from './aiProvider';
import { stripCodeFence } from './openaiCompatibleProvider';

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
  error?: string;
}

export class OllamaProvider implements AIProvider {
  constructor(
    private readonly model: string,
    private readonly baseUrl = 'http://localhost:11434'
  ) {}

  async generateCommitMessage(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl.replace(/\/+$/, '')}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        options: {
          temperature: 0
        },
        messages: [
          {
            role: 'system',
            content: 'Generate terse, factual Git commit messages from diffs. Strictly follow the requested language and output format. Do not infer intent beyond the visible diff.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await readJson<OllamaChatResponse>(response);
    if (!response.ok) {
      throw new Error(data.error || `Ollama request failed with status ${response.status}`);
    }

    const message = data.message?.content?.trim();
    if (!message) {
      throw new Error('AI 返回为空，请重试。');
    }

    return stripCodeFence(message);
  }
}

async function readJson<T>(response: Response): Promise<T> {
  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
}
