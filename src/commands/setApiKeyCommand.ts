import * as vscode from 'vscode';
import { ConfigService } from '../services/configService';
import { SecretService } from '../services/secretService';

export async function setApiKeyCommand(secretService: SecretService, configService: ConfigService): Promise<void> {
  const provider = configService.getConfig().provider;
  if (provider === 'ollama') {
    vscode.window.showInformationMessage('Ollama 默认使用本地服务，不需要 API Key。');
    return;
  }

  const apiKey = await vscode.window.showInputBox({
    title: `Commit AI: Set ${provider} API Key`,
    prompt: `Enter your ${provider} API key. It will be stored in VS Code SecretStorage.`,
    password: true,
    ignoreFocusOut: true
  });

  if (!apiKey) {
    return;
  }

  await secretService.storeApiKey(provider, apiKey.trim());
  vscode.window.showInformationMessage(`Commit AI ${provider} API Key 已保存。`);
}
