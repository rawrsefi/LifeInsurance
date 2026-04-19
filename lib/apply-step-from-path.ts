/** Map Zod issue path (dot notation) to Apply wizard step index 0–7. */
export function stepFromValidationPath(path: string): number {
  const root = path.split(".")[0] ?? "";
  switch (root) {
    case "insured":
      return 0;
    case "ownerSameAsInsured":
    case "owner":
      return 1;
    case "coverage":
      return 2;
    case "otherInsurance":
      return 3;
    case "beneficiaries":
      return 4;
    case "medical":
      return 5;
    case "banking":
    case "doctor":
    case "employment":
      return 6;
    case "attestations":
    case "submittedAt":
      return 7;
    default:
      return 0;
  }
}
