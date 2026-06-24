import * as vscode from 'vscode';
import { GitRepositoryLike } from '../types';

interface GitExtension {
  getAPI(version: 1): GitAPI;
}

interface GitAPI {
  repositories: GitRepositoryLike[];
}

export class CommitWriterService {
  async write(message: string): Promise<void> {
    const repository = await this.selectRepository();
    this.writeToRepository(repository, message);
  }

  writeToRepository(repository: GitRepositoryLike, message: string): void {
    repository.inputBox.value = message;
  }

  async selectRepository(): Promise<GitRepositoryLike> {
    const extension = vscode.extensions.getExtension<GitExtension>('vscode.git');
    if (!extension) {
      throw new Error('Git 扩展不可用，请确认 VS Code 内置 Git 扩展已启用。');
    }

    const gitExtension = extension.isActive ? extension.exports : await extension.activate();
    const git = gitExtension.getAPI(1);
    if (!git.repositories.length) {
      throw new Error('未检测到 VS Code Git 仓库，请确认当前工作区已打开 Git 仓库。');
    }

    if (git.repositories.length === 1) {
      return git.repositories[0];
    }

    return this.pickRepository(git.repositories);
  }

  private async pickRepository(repositories: GitRepositoryLike[]): Promise<GitRepositoryLike> {
    const items = repositories.map((repository, index) => ({
      label: repository.rootUri ? vscode.workspace.asRelativePath(repository.rootUri) : `Repository ${index + 1}`,
      repository
    }));

    const selected = await vscode.window.showQuickPick(items, {
      title: 'Commit AI: Select Repository',
      placeHolder: '选择要写入提交消息的 Git 仓库'
    });

    if (!selected) {
      throw new Error('已取消选择 Git 仓库。');
    }

    return selected.repository;
  }
}
