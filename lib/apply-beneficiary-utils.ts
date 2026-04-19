/** Integer percentages that sum to 100 for `count` beneficiaries (first entries get +1 when remainder). */
export function equalBeneficiaryPercents(count: number): number[] {
  if (count < 1) return [100];
  if (count === 1) return [100];
  const base = Math.floor(100 / count);
  let remainder = 100 - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}
