import * as vscode from 'vscode';
import { ConfigService } from '../services/configService';
import { CommitLanguage } from '../types';

const LANGUAGE_OPTIONS: Array<{ label: string; description: string; value: CommitLanguage }> = [
  { label: '中文', description: '生成中文提交消息', value: 'zh-CN' },
  { label: 'English', description: 'Generate English commit messages', value: 'en-US' },
  { label: '中英双语', description: '生成中文和英文提交消息', value: 'bilingual' }
];

export async function selectLanguageCommand(configService: ConfigService): Promise<void> {
  const selected = await vscode.window.showQuickPick(LANGUAGE_OPTIONS, {
    title: 'Commit AI: Change Language',
    placeHolder: '选择提交消息语言'
  });

  if (!selected) {
    return;
  }

  await configService.updateLanguage(selected.value);
  vscode.window.showInformationMessage(`Commit AI 语言已切换为：${selected.label}`);
}
