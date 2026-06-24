import * as vscode from 'vscode';
import { GitChanges, DiffMode, GitRepositoryLike } from '../types';
import { isWhitespaceOnlyDiff } from '../utils/analyzeDiff';
import { execGit } from '../utils/exec';

export class GitService {
  async getChanges(mode: DiffMode, repository?: GitRepositoryLike): Promise<GitChanges> {
    const root = this.getWorkspaceRoot(repository);
    await this.ensureGitRepository(root);

    const [branch, files, stats] = await Promise.all([
      this.getCurrentBranch(root),
      this.getChangedFiles(root),
      this.getDiffStats(root, mode)
    ]);

    const diff = await this.getDiffByMode(root, mode);
    if (!diff.diff.trim()) {
      throw new Error('没有检测到 Git 变更，请先修改或暂存文件。');
    }

    return {
      root,
      branch,
      files,
      stats,
      diff: diff.diff,
      source: diff.source,
      whitespaceOnly: isWhitespaceOnlyDiff(diff.diff),
      truncated: false,
      originalDiffLength: diff.diff.length
    };
  }

  getWorkspaceRoot(repository?: GitRepositoryLike): string {
    if (repository?.rootUri) {
      return repository.rootUri.fsPath;
    }

    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
      throw new Error('未打开工作区，请先打开一个包含 Git 仓库的项目。');
    }

    return folder.uri.fsPath;
  }

  async getChangedFiles(root: string): Promise<string> {
    return execGit(['status', '--short'], root);
  }

  async getDiffStats(root: string, mode: DiffMode): Promise<string> {
    if (mode === 'staged') {
      return execGit(['diff', '--cached', '--stat'], root);
    }

    if (mode === 'unstaged') {
      return execGit(['diff', '--stat'], root);
    }

    if (mode === 'all') {
      const [staged, unstaged] = await Promise.all([
        execGit(['diff', '--cached', '--stat'], root),
        execGit(['diff', '--stat'], root)
      ]);
      return [staged, unstaged].filter(Boolean).join('\n');
    }

    const staged = await execGit(['diff', '--cached', '--stat'], root);
    if (staged.trim()) {
      return staged;
    }

    return execGit(['diff', '--stat'], root);
  }

  async getCurrentBranch(root: string): Promise<string> {
    try {
      return await execGit(['branch', '--show-current'], root);
    } catch {
      return 'unknown';
    }
  }

  async getStagedDiff(root: string): Promise<string> {
    return execGit(['diff', '--cached'], root);
  }

  async getUnstagedDiff(root: string): Promise<string> {
    return execGit(['diff'], root);
  }

  private async ensureGitRepository(root: string): Promise<void> {
    try {
      await execGit(['rev-parse', '--is-inside-work-tree'], root);
    } catch {
      throw new Error('未检测到 Git 仓库，请确认当前工作区已初始化 Git。');
    }
  }

  private async getDiffByMode(root: string, mode: DiffMode, ignoreWhitespace = false): Promise<{ diff: string; source: GitChanges['source'] }> {
    const whitespaceArgs = ignoreWhitespace ? ['-w'] : [];

    if (mode === 'staged') {
      return { diff: await execGit(['diff', '--cached', ...whitespaceArgs], root), source: 'staged' };
    }

    if (mode === 'unstaged') {
      return { diff: await execGit(['diff', ...whitespaceArgs], root), source: 'unstaged' };
    }

    if (mode === 'all') {
      const [staged, unstaged] = await Promise.all([
        execGit(['diff', '--cached', ...whitespaceArgs], root),
        execGit(['diff', ...whitespaceArgs], root)
      ]);
      return { diff: [staged, unstaged].filter(Boolean).join('\n\n'), source: 'all' };
    }

    const staged = await execGit(['diff', '--cached', ...whitespaceArgs], root);
    if (staged.trim()) {
      return { diff: staged, source: 'staged' };
    }

    return { diff: await execGit(['diff', ...whitespaceArgs], root), source: 'unstaged' };
  }
}
