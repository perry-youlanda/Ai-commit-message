import * as vscode from 'vscode';
import { AIProvider } from '../providers/aiProvider';
import { createProvider, providerNeedsApiKey } from '../providers/providerFactory';
import { CommitWriterService } from '../services/commitWriterService';
import { ConfigService } from '../services/configService';
import { GitService } from '../services/gitService';
import { SecretService } from '../services/secretService';
import { buildCommitPrompt } from '../prompts/commitPromptBuilder';
import { truncateDiff } from '../utils/truncateDiff';
import { showError } from '../utils/errorHandler';
import { CommitAIConfig, GitChanges } from '../types';

export async function generateCommitMessageCommand(
  gitService: GitService,
  configService: ConfigService,
  secretService: SecretService,
  commitWriterService: CommitWriterService
): Promise<void> {
  try {
    const config = configService.getConfig();
    const apiKey = providerNeedsApiKey(config) ? await secretService.getApiKey(config.provider) : undefined;
    if (providerNeedsApiKey(config) && !apiKey) {
      const action = await vscode.window.showErrorMessage(
        `请先配置 Commit AI ${config.provider} API Key。`,
        'Set API Key'
      );
      if (action === 'Set API Key') {
        await vscode.commands.executeCommand('commitAI.setApiKey');
      }
      return;
    }

    const repository = await commitWriterService.selectRepository();
    const changes = await gitService.getChanges(config.diffMode, repository);
    if (changes.whitespaceOnly) {
      const message = getWhitespaceOnlyMessage(config);
      commitWriterService.writeToRepository(repository, message);
      vscode.window.showInformationMessage('Commit AI 已识别为空白格式改动并写入提交输入框。');
      return;
    }

    const provider = createProvider(config, apiKey);

    while (true) {
      const message = await generateMessage(provider, config, changes);

      if (!config.showPreview) {
        commitWriterService.writeToRepository(repository, message);
        vscode.window.showInformationMessage('Commit AI 已写入 Git 提交输入框。');
        return;
      }

      const preview = await previewMessage(message, changes.source, changes.branch);
      const action = preview.action;
      if (action === 'Use') {
        commitWriterService.writeToRepository(repository, preview.message);
        vscode.window.showInformationMessage('Commit AI 已写入 Git 提交输入框。');
        return;
      }

      if (action === 'Regenerate') {
        continue;
      }

      if (action === 'Copy') {
        await vscode.env.clipboard.writeText(preview.message);
        vscode.window.showInformationMessage('提交消息已复制到剪贴板。');
        return;
      }

      return;
    }
  } catch (error) {
    showError('Commit AI 生成失败', error);
  }
}

function getWhitespaceOnlyMessage(config: CommitAIConfig): string {
  if (config.language === 'en-US') {
    return 'style: 💄 adjust whitespace formatting';
  }

  if (config.language === 'bilingual') {
    return `中文：
style: 💄 调整空白格式

English:
style: 💄 adjust whitespace formatting`;
  }

  return 'style: 💄 调整空白格式';
}

async function generateMessage(
  provider: AIProvider,
  config: CommitAIConfig,
  changes: GitChanges
): Promise<string> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Commit AI 正在分析 ${changes.source} 变更...`,
      cancellable: false
    },
    async () => {
      const diff = truncateDiff(changes.diff, config.maxDiffLength);
      changes.truncated = diff.truncated;
      changes.originalDiffLength = diff.originalLength;
      if (diff.truncated) {
        vscode.window.showWarningMessage(
          `Git diff 过长，已从 ${diff.originalLength} 字符截断到 ${config.maxDiffLength} 字符后发送给 AI。`
        );
      }
      const prompt = buildCommitPrompt({
        diff: diff.value,
        files: changes.files,
        stats: changes.stats,
        language: config.language,
        style: config.style
      });

      return provider.generateCommitMessage(prompt);
    }
  );
}

async function previewMessage(
  message: string,
  source: string,
  branch: string
): Promise<{ action: 'Use' | 'Regenerate' | 'Copy' | undefined; message: string }> {
  const document = await vscode.workspace.openTextDocument({
    content: message,
    language: 'git-commit'
  });
  await vscode.window.showTextDocument(document, { preview: true });

  const action = await vscode.window.showInformationMessage<'Use' | 'Regenerate' | 'Copy' | 'Cancel'>(
    `Commit AI 已生成提交消息 (${source}, ${branch || 'unknown'})`,
    'Use',
    'Regenerate',
    'Copy',
    'Cancel'
  );

  return {
    action: action === 'Cancel' ? undefined : action,
    message: document.getText().trim()
  };
}
