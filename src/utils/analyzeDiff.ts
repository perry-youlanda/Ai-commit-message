export function isWhitespaceOnlyDiff(diff: string): boolean {
  const changedLines = diff
    .split(/\r?\n/)
    .filter((line) =>
      (line.startsWith('+') && !line.startsWith('+++')) ||
      (line.startsWith('-') && !line.startsWith('---'))
    )
    .map((line) => ({
      sign: line[0],
      text: line.slice(1)
    }));

  if (!changedLines.length) {
    return false;
  }

  if (changedLines.every((line) => line.text.trim() === '')) {
    return true;
  }

  const removed = changedLines.filter((line) => line.sign === '-').map((line) => line.text.trim());
  const added = changedLines.filter((line) => line.sign === '+').map((line) => line.text.trim());

  return removed.length === added.length && removed.every((line, index) => line === added[index]);
}
