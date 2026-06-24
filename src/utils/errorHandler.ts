import * as vscode from 'vscode';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function showError(prefix: string, error: unknown): void {
  vscode.window.showErrorMessage(`${prefix}: ${getErrorMessage(error)}`);
}
