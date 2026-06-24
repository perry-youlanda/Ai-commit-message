import * as vscode from 'vscode';
import { ConfigService } from '../services/configService';
import { CommitStyle } from '../types';

const STYLE_OPTIONS: Array<{ label: string; description: string; value: CommitStyle }> = [
  { label: 'emojiConventional', description: 'emoji + type + 经典提交文本规范', value: 'emojiConventional' },
  { label: 'conventional', description: 'feat/fix/chore 等 Conventional Commits 格式', value: 'conventional' },
  { label: 'simple', description: '简单一句话', value: 'simple' },
  { label: 'detailed', description: '标题加多条说明', value: 'detailed' }
];

export async function selectStyleCommand(configService: ConfigService): Promise<void> {
  const selected = await vscode.window.showQuickPick(STYLE_OPTIONS, {
    title: 'Commit AI: Change Style',
    placeHolder: '选择提交消息风格'
  });

  if (!selected) {
    return;
  }

  await configService.updateStyle(selected.value);
  vscode.window.showInformationMessage(`Commit AI 风格已切换为：${selected.label}`);
}
