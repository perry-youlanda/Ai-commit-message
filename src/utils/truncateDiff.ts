export interface TruncatedDiff {
  value: string;
  truncated: boolean;
  originalLength: number;
}

export function truncateDiff(diff: string, maxLength: number): TruncatedDiff {
  if (diff.length <= maxLength) {
    return {
      value: diff,
      truncated: false,
      originalLength: diff.length
    };
  }

  const notice = `\n\n[Diff truncated to ${maxLength} characters. Analyze only the visible changes.]`;
  return {
    value: `${diff.slice(0, Math.max(0, maxLength - notice.length))}${notice}`,
    truncated: true,
    originalLength: diff.length
  };
}
