export function getScoreTextColorClass(score: number): string {
  if (score < 33) return 'text-[var(--color-gray-warm-600)]';
  if (score < 66) return 'text-[var(--color-yellow-600)]';
  return 'text-[var(--color-success-600)]';
}

export function getScoreColorClasses(score: number): string {
  if (score < 33)
    return 'text-[var(--color-gray-warm-600)] bg-[var(--color-gray-warm-25)] border border-dashed border-[var(--color-gray-warm-200)]';
  if (score < 66)
    return 'text-[var(--color-yellow-600)] bg-[var(--color-yellow-25)] border border-dashed border-[var(--color-yellow-200)]';
  return 'text-[var(--color-success-600)] bg-[var(--color-moss-25)] border border-dashed border-[var(--color-moss-200)]';
}

export function getReliability(reliability: number): number {
  return Math.round(reliability * 100 || 0);
}
