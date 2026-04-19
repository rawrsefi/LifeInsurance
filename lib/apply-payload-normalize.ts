/** Recursively trim strings so stray spaces don’t fail validation (e.g. state "CA "). */
export function deepTrimPayloadStrings(value: unknown): unknown {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(deepTrimPayloadStrings);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepTrimPayloadStrings(v)])
    );
  }
  return value;
}
