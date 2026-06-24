import { AIProvider } from './aiProvider';

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

export class OpenAICompatibleProvider implements AIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string,
    private readonly providerName: string
  ) {}

  async generateCommitMessage(prompt: string): Promise<string> {
    const response = await fetch(getChatCompletionsUrl(this.baseUrl), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
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

    const data = await readJson<ChatCompletionResponse>(response);
    if (!response.ok) {
      throw new Error(data.error?.message || `${this.providerName} request failed with status ${response.status}`);
    }

    const message = data.choices?.[0]?.message?.content?.trim();
    if (!message) {
      throw new Error('AI 返回为空，请重试。');
    }

    return stripCodeFence(message);
  }
}

function getChatCompletionsUrl(baseUrl: string): string {
  const normalized = baseUrl.trim().replace(/\/+$/, '');
  if (normalized.endsWith('/chat/completions')) {
    return normalized;
  }

  return `${normalized}/chat/completions`;
}

async function readJson<T>(response: Response): Promise<T> {
  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
}

export function stripCodeFence(message: string): string {
  return message
    .replace(/^```[a-zA-Z]*\s*/, '')
    .replace(/\s*```$/, '')
    .trim();
}
