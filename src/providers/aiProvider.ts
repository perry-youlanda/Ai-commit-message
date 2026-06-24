export interface AIProvider {
  generateCommitMessage(prompt: string): Promise<string>;
}
