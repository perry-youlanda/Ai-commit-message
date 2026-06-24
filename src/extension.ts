import * as vscode from 'vscode';
import { clearApiKeyCommand } from './commands/clearApiKeyCommand';
import { generateCommitMessageCommand } from './commands/generateCommitMessageCommand';
import { selectLanguageCommand } from './commands/selectLanguageCommand';
import { selectStyleCommand } from './commands/selectStyleCommand';
import { setApiKeyCommand } from './commands/setApiKeyCommand';
import { CommitWriterService } from './services/commitWriterService';
import { ConfigService } from './services/configService';
import { GitService } from './services/gitService';
import { SecretService } from './services/secretService';

export function activate(context: vscode.ExtensionContext): void {
  const gitService = new GitService();
  const configService = new ConfigService();
  const secretService = new SecretService(context.secrets);
  const commitWriterService = new CommitWriterService();

  context.subscriptions.push(
    vscode.commands.registerCommand('commitAI.generateCommitMessage', () =>
      generateCommitMessageCommand(gitService, configService, secretService, commitWriterService)
    ),
    vscode.commands.registerCommand('commitAI.setApiKey', () =>
      setApiKeyCommand(secretService, configService)
    ),
    vscode.commands.registerCommand('commitAI.clearApiKey', () =>
      clearApiKeyCommand(secretService, configService)
    ),
    vscode.commands.registerCommand('commitAI.changeLanguage', () =>
      selectLanguageCommand(configService)
    ),
    vscode.commands.registerCommand('commitAI.changeStyle', () =>
      selectStyleCommand(configService)
    )
  );
}

export function deactivate(): void {}
