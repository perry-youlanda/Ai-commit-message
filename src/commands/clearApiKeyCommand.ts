import * as vscode from 'vscode';
import { ConfigService } from '../services/configService';
import { SecretService } from '../services/secretService';

export async function clearApiKeyCommand(secretService: SecretService, configService: ConfigService): Promise<void> {
  const provider = configService.getConfig().provider;
  const confirmed = await vscode.window.showWarningMessage(
    `确定要清除 Commit AI 保存的 ${provider} API Key 吗？`,
    { modal: true },
    'Clear'
  );

  if (confirmed !== 'Clear') {
    return;
  }

  await secretService.deleteApiKey(provider);
  vscode.window.showInformationMessage(`Commit AI ${provider} API Key 已清除。`);
}
