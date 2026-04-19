"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { encryptApplicationJwe } from "@/lib/apply-jwe-client";
import { deepTrimPayloadStrings } from "@/lib/apply-payload-normalize";
import { equalBeneficiaryPercents } from "@/lib/apply-beneficiary-utils";
import { createInitialApplyPayload } from "@/lib/apply-defaults";
import { applyPayloadSchema } from "@/lib/apply-schema";
import type { ApplyPayload } from "@/lib/apply-schema";
import { SensitiveField } from "@/components/apply/SensitiveField";
import { stepFromValidationPath } from "@/lib/apply-step-from-path";

const STEPS = [
  "Proposed insured",
  "Owner",
  "Coverage & ACH",
  "Other insurance",
  "Beneficiaries",
  "Medical",
  "Banking & work",
  "Review",
];

function getPublicKeyPem(): string | null {
  const raw = process.env.NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM;
  if (!raw) return null;
  return raw.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
}

const fieldCls =
  "w-full min-h-[48px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/25";

function inpCls() {
  return fieldCls;
}

function textareaFieldCls() {
  return `${fieldCls} min-h-[128px] resize-y py-3`;
}

function Label({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-800 mb-2 tracking-tight">
      {children}
      {req ? <span className="text-red-500 font-bold"> *</span> : null}
    </label>
  );
}

function issuesToStrings(issues: { path: string; message: string }[]): string[] {
  return issues.map((i) => (i.path === "form" ? i.message : `${i.path}: ${i.message}`));
}

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ApplyPayload>(() => createInitialApplyPayload());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [validationIssues, setValidationIssues] = useState<string[]>([]);

  const publicKey = useMemo(() => getPublicKeyPem(), []);

  const set = (patch: Partial<ApplyPayload>) => setForm((f) => ({ ...f, ...patch }));
  const setInsured = (patch: Partial<ApplyPayload["insured"]>) =>
    setForm((f) => ({ ...f, insured: { ...f.insured, ...patch } }));
  const setCoverage = (patch: Partial<ApplyPayload["coverage"]>) =>
    setForm((f) => ({ ...f, coverage: { ...f.coverage, ...patch } }));

  async function submit() {
    if (!publicKey) {
      setErrorMsg("Application encryption is not configured (missing public key).");
      setValidationIssues([]);
      setStatus("error");
      return;
    }
    setErrorMsg("");
    setValidationIssues([]);

    const raw = { ...form, submittedAt: new Date().toISOString() };
    const trimmed = deepTrimPayloadStrings(raw);
    const checked = applyPayloadSchema.safeParse(trimmed);
    if (!checked.success) {
      const lines = checked.error.issues.map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message));
      setValidationIssues(lines);
      const firstPath = checked.error.issues[0]?.path.join(".") ?? "";
      setStep(stepFromValidationPath(firstPath));
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const json = JSON.stringify(checked.data);
      const jwe = await encryptApplicationJwe(json, publicKey);
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwe }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        issues?: { path: string; message: string }[];
      };
      if (!res.ok) {
        const list = data.issues?.length ? issuesToStrings(data.issues) : [];
        setValidationIssues(list);
        setErrorMsg(data.error || list[0] || "Submission failed");
        if (data.issues?.[0]?.path) {
          setStep(stepFromValidationPath(data.issues[0].path));
        } else {
          setStep(7);
        }
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Error");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-green-200/80 bg-gradient-to-br from-green-50 to-white p-10 text-center shadow-lg shadow-green-900/5">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">✓</div>
        <h2 className="text-2xl font-bold text-green-900">Application received</h2>
        <p className="mt-3 leading-relaxed text-green-800/90">
          Thank you. Our team will review your submission and reach out if anything else is needed.
        </p>
        <Link href="/" className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-purple px-8 font-semibold text-white shadow-md shadow-brand-purple/20 transition hover:bg-brand-purple-dark">
          Return home
        </Link>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900 text-sm">
        <p className="font-semibold mb-2">Setup required</p>
        <p>Add <code className="bg-amber-100 px-1">NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM</code> and server <code className="bg-amber-100 px-1">APPLY_RSA_PRIVATE_KEY_PEM</code> to your environment. Run <code className="bg-amber-100 px-1">node scripts/generate-apply-keys.mjs</code> to create a keypair.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {(errorMsg || validationIssues.length > 0) && (
        <div
          className="mb-8 rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 to-white px-5 py-4 shadow-sm"
          role="alert"
        >
          <p className="font-semibold text-red-900">We couldn&apos;t submit yet</p>
          {errorMsg ? <p className="mt-2 text-sm text-red-800">{errorMsg}</p> : null}
          {validationIssues.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-red-900/90">
              {validationIssues.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 text-xs text-red-800/80">
            We moved you to the step that matches the first problem. Use <strong>Continue</strong> on each screen in order—don&apos;t skip to Review until every section is filled. Check all five boxes on Review, beneficiary % totals 100, ACH date, 9-digit routing, employer fields if employed/self-employed.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40 ring-1 ring-gray-100 md:p-10">
        <div className="mb-10 border-b border-gray-100 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-purple/90">Step {step + 1} of {STEPS.length}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{STEPS[step]}</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {STEPS.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setStep(i);
                  setValidationIssues([]);
                  setErrorMsg("");
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  step === i ? "bg-brand-purple text-white shadow-md shadow-brand-purple/25" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {i + 1}. {t}
              </button>
            ))}
          </div>
        </div>

      {step === 0 && (
        <section className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label req>First name</Label>
              <input className={inpCls()} value={form.insured.firstName} onChange={(e) => setInsured({ firstName: e.target.value })} />
            </div>
            <div>
              <Label>Middle</Label>
              <input className={inpCls()} value={form.insured.middleName || ""} onChange={(e) => setInsured({ middleName: e.target.value })} />
            </div>
            <div>
              <Label req>Last name</Label>
              <input className={inpCls()} value={form.insured.lastName} onChange={(e) => setInsured({ lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label req>Address line 1</Label>
            <input className={inpCls()} value={form.insured.address1} onChange={(e) => setInsured({ address1: e.target.value })} />
          </div>
          <div>
            <Label>Address line 2</Label>
            <input className={inpCls()} value={form.insured.address2 || ""} onChange={(e) => setInsured({ address2: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label req>City</Label>
              <input className={inpCls()} value={form.insured.city} onChange={(e) => setInsured({ city: e.target.value })} />
            </div>
            <div>
              <Label req>State</Label>
              <input className={inpCls()} maxLength={2} value={form.insured.state} onChange={(e) => setInsured({ state: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <Label req>ZIP</Label>
              <input className={inpCls()} value={form.insured.zip} onChange={(e) => setInsured({ zip: e.target.value })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label req>Sex</Label>
              <select className={inpCls()} value={form.insured.sex} onChange={(e) => setInsured({ sex: e.target.value as "F" | "M" })}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div>
              <Label req>Date of birth</Label>
              <input type="date" className={inpCls()} value={form.insured.dob} onChange={(e) => setInsured({ dob: e.target.value })} />
            </div>
            <div>
              <Label req>State/country of birth</Label>
              <input className={inpCls()} value={form.insured.birthStateOrCountry} onChange={(e) => setInsured({ birthStateOrCountry: e.target.value })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label req>Email</Label>
              <input type="email" className={inpCls()} value={form.insured.email} onChange={(e) => setInsured({ email: e.target.value })} />
            </div>
            <div>
              <Label req>Phone</Label>
              <input type="tel" className={inpCls()} value={form.insured.phone} onChange={(e) => setInsured({ phone: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.insured.usCitizen} onChange={(e) => setInsured({ usCitizen: e.target.checked })} />
              U.S. citizen
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.insured.legalUsResident} onChange={(e) => setInsured({ legalUsResident: e.target.checked })} />
              Legal U.S. resident (if not citizen)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.insured.felonyConviction} onChange={(e) => setInsured({ felonyConviction: e.target.checked })} />
              Felony conviction (ever)
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label req>SSN / Tax ID</Label>
              <SensitiveField
                className={fieldCls}
                value={form.insured.ssnOrTaxId}
                onChange={(v) => setInsured({ ssnOrTaxId: v })}
                aria-label="Social Security or Tax ID"
              />
              <p className="mt-1.5 text-xs text-gray-500">Hidden while typing (like a password). Still encrypted with the rest of your application before it is sent.</p>
            </div>
            <div>
              <Label req>Driver license or state ID</Label>
              <SensitiveField
                className={fieldCls}
                value={form.insured.driversLicenseOrStateId}
                onChange={(v) => setInsured({ driversLicenseOrStateId: v })}
                aria-label="Driver license or state ID number"
              />
            </div>
          </div>
          <h3 className="font-semibold pt-4">Trusted contact</h3>
          <div className="grid gap-3">
            <div>
              <Label req>Name</Label>
              <input className={inpCls()} value={form.insured.trustedContact.name} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, trustedContact: { ...f.insured.trustedContact, name: e.target.value } } }))} />
            </div>
            <div>
              <Label req>Address</Label>
              <input className={inpCls()} value={form.insured.trustedContact.address} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, trustedContact: { ...f.insured.trustedContact, address: e.target.value } } }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label req>Phone</Label>
                <input className={inpCls()} value={form.insured.trustedContact.phone} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, trustedContact: { ...f.insured.trustedContact, phone: e.target.value } } }))} />
              </div>
              <div>
                <Label>Email</Label>
                <input className={inpCls()} value={form.insured.trustedContact.email || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, trustedContact: { ...f.insured.trustedContact, email: e.target.value } } }))} />
              </div>
            </div>
            <div>
              <Label req>Relationship</Label>
              <input className={inpCls()} value={form.insured.trustedContact.relationship} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, trustedContact: { ...f.insured.trustedContact, relationship: e.target.value } } }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.insured.secondaryAddressee.wantsCopy}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, wantsCopy: e.target.checked } },
                }))
              }
            />
            Designate secondary addressee for past-due notices
          </label>
          {form.insured.secondaryAddressee.wantsCopy && (
            <div className="grid sm:grid-cols-2 gap-3 border rounded-lg p-4 bg-gray-50">
              <input placeholder="First" className={inpCls()} value={form.insured.secondaryAddressee.firstName || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, firstName: e.target.value } } }))} />
              <input placeholder="Last" className={inpCls()} value={form.insured.secondaryAddressee.lastName || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, lastName: e.target.value } } }))} />
              <input placeholder="Address" className={inpCls()} value={form.insured.secondaryAddressee.address1 || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, address1: e.target.value } } }))} />
              <input placeholder="City" className={inpCls()} value={form.insured.secondaryAddressee.city || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, city: e.target.value } } }))} />
              <input placeholder="ST" className={inpCls()} maxLength={2} value={form.insured.secondaryAddressee.state || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, state: e.target.value.toUpperCase() } } }))} />
              <input placeholder="ZIP" className={inpCls()} value={form.insured.secondaryAddressee.zip || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, zip: e.target.value } } }))} />
              <input placeholder="Phone" className={inpCls()} value={form.insured.secondaryAddressee.phone || ""} onChange={(e) => setForm((f) => ({ ...f, insured: { ...f.insured, secondaryAddressee: { ...f.insured.secondaryAddressee, phone: e.target.value } } }))} />
            </div>
          )}
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Section 2 — Owner (if not the insured)</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.ownerSameAsInsured}
              onChange={(e) =>
                set({
                  ownerSameAsInsured: e.target.checked,
                  owner: e.target.checked ? undefined : { firstName: "", middleName: "", lastName: "", address1: "", city: "", state: "", zip: "", phone: "", email: "", relationshipToInsured: "", ssnOrTaxId: "", dob: "", sex: "M", usCitizen: true },
                })
              }
            />
            Owner is the same as proposed insured
          </label>
          {!form.ownerSameAsInsured && (
            <div className="space-y-3 border rounded-lg p-4">
              {(["firstName", "middleName", "lastName", "address1", "city", "state", "zip", "phone", "email", "relationshipToInsured", "dob"] as const).map((field) => (
                <div key={field}>
                  <Label>{field}</Label>
                  <input
                    className={inpCls()}
                    value={(form.owner?.[field] as string) || ""}
                    onChange={(e) => setForm((f) => ({ ...f, owner: { ...f.owner, [field]: e.target.value } }))}
                  />
                </div>
              ))}
              <div>
                <Label>SSN / Tax ID</Label>
                <SensitiveField
                  className={fieldCls}
                  value={form.owner?.ssnOrTaxId || ""}
                  onChange={(v) => setForm((f) => ({ ...f, owner: { ...f.owner, ssnOrTaxId: v } }))}
                  aria-label="Owner SSN or Tax ID"
                />
              </div>
              <div>
                <Label>Sex</Label>
                <select
                  className={inpCls()}
                  value={form.owner?.sex || "M"}
                  onChange={(e) => setForm((f) => ({ ...f, owner: { ...f.owner, sex: e.target.value as "F" | "M" } }))}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.owner?.usCitizen ?? true} onChange={(e) => setForm((f) => ({ ...f, owner: { ...f.owner, usCitizen: e.target.checked } }))} />
                U.S. citizen
              </label>
            </div>
          )}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Section 3 — Coverage & ACH</h2>
          <div>
            <Label req>Payment mode</Label>
            <select className={inpCls()} value={form.coverage.paymentMode} onChange={(e) => setCoverage({ paymentMode: e.target.value as ApplyPayload["coverage"]["paymentMode"] })}>
              <option value="monthly">Monthly (EFT)</option>
              <option value="quarterly">Quarterly</option>
              <option value="semiAnnual">Semi-annual</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label req>Requested face amount ($)</Label>
              <input className={inpCls()} value={form.coverage.faceAmount} onChange={(e) => setCoverage({ faceAmount: e.target.value })} />
            </div>
            <div>
              <Label>Premium with application ($)</Label>
              <input className={inpCls()} value={form.coverage.premiumWithApplication || ""} onChange={(e) => setCoverage({ premiumWithApplication: e.target.value })} />
            </div>
          </div>
          <div>
            <Label req>Plan</Label>
            <select className={inpCls()} value={form.coverage.plan} onChange={(e) => setCoverage({ plan: e.target.value as ApplyPayload["coverage"]["plan"] })}>
              <option value="level">Level death benefit</option>
              <option value="graded">Graded death benefit</option>
              <option value="guaranteedIssue">Guaranteed issue</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.coverage.acceptModifiedPlan} onChange={(e) => setCoverage({ acceptModifiedPlan: e.target.checked })} />
            Accept modified rate class or plan if original cannot be issued
          </label>
          <div>
            <Label req>Preferred ACH draft date</Label>
            <input type="date" className={inpCls()} value={form.coverage.achWithdrawalDate} onChange={(e) => setCoverage({ achWithdrawalDate: e.target.value })} />
          </div>
          <div>
            <Label>Day of month (1–28) if recurring monthly</Label>
            <input
              type="number"
              min={1}
              max={28}
              className={inpCls()}
              value={form.coverage.achWithdrawalDayOfMonth ?? ""}
              onChange={(e) => setCoverage({ achWithdrawalDayOfMonth: parseInt(e.target.value, 10) || undefined })}
            />
          </div>
          <h3 className="font-semibold">Riders</h3>
          <div className="space-y-2 text-sm">
            <label className="flex gap-2">
              <input type="checkbox" checked={form.coverage.riders.acceleratedDeathBenefit} onChange={(e) => setForm((f) => ({ ...f, coverage: { ...f.coverage, riders: { ...f.coverage.riders, acceleratedDeathBenefit: e.target.checked } } }))} />
              Accelerated death benefit
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={form.coverage.riders.accidentalDeathBenefit} onChange={(e) => setForm((f) => ({ ...f, coverage: { ...f.coverage, riders: { ...f.coverage.riders, accidentalDeathBenefit: e.target.checked } } }))} />
              Accidental death benefit — face $
              <input className={`${fieldCls} max-w-[140px]`} value={form.coverage.riders.accidentalDeathFaceAmount || ""} onChange={(e) => setForm((f) => ({ ...f, coverage: { ...f.coverage, riders: { ...f.coverage.riders, accidentalDeathFaceAmount: e.target.value } } }))} />
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={form.coverage.riders.charitableGiving} onChange={(e) => setForm((f) => ({ ...f, coverage: { ...f.coverage, riders: { ...f.coverage.riders, charitableGiving: e.target.checked } } }))} />
              Charitable giving — charity name
              <input className={inpCls()} value={form.coverage.riders.charityName || ""} onChange={(e) => setForm((f) => ({ ...f, coverage: { ...f.coverage, riders: { ...f.coverage.riders, charityName: e.target.value } } }))} />
            </label>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Section 4 — Other insurance</h2>
          <label className="flex gap-2">
            <input type="checkbox" checked={form.otherInsurance.hasRoyalNeighbors} onChange={(e) => setForm((f) => ({ ...f, otherInsurance: { ...f.otherInsurance, hasRoyalNeighbors: e.target.checked } }))} />
            Existing or applied coverage with same carrier network / fraternal society
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={form.otherInsurance.hasOtherCompanies} onChange={(e) => setForm((f) => ({ ...f, otherInsurance: { ...f.otherInsurance, hasOtherCompanies: e.target.checked } }))} />
            Existing or applied with other companies
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={form.otherInsurance.replacementDisclosure} onChange={(e) => setForm((f) => ({ ...f, otherInsurance: { ...f.otherInsurance, replacementDisclosure: e.target.checked } }))} />
            Replacement / surrender / loan / lapse activity related to this application
          </label>
          <div>
            <Label>Notes</Label>
            <textarea className={textareaFieldCls()} rows={3} value={form.otherInsurance.replacementNote || ""} onChange={(e) => setForm((f) => ({ ...f, otherInsurance: { ...f.otherInsurance, replacementNote: e.target.value } }))} />
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-6">
          <h2 className="text-lg font-bold">Section 5 — Beneficiaries (total % must equal 100)</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Each beneficiary needs a <strong>full mailing address</strong>, <strong>relationship</strong>, <strong>date of birth</strong>, and <strong>percent</strong>. If the primary lives at the same address as the proposed insured, use the button below.
          </p>
          <button
            type="button"
            className="rounded-xl border border-brand-purple/30 bg-white px-4 py-2.5 text-sm font-semibold text-brand-purple shadow-sm hover:bg-brand-purple/5"
            onClick={() =>
              setForm((f) => {
                const i = f.insured;
                const n = [...f.beneficiaries];
                if (!n[0]) return f;
                n[0] = {
                  ...n[0],
                  address1: i.address1,
                  address2: i.address2 || "",
                  city: i.city,
                  state: i.state,
                  zip: i.zip,
                };
                return { ...f, beneficiaries: n };
              })
            }
          >
            Copy proposed insured&apos;s address to beneficiary 1
          </button>
          {form.beneficiaries.map((b, idx) => (
            <div key={idx} className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Beneficiary {idx + 1}</span>
                {form.beneficiaries.length > 1 && (
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                    onClick={() =>
                      setForm((f) => {
                        const next = f.beneficiaries.filter((_, i) => i !== idx);
                        const p = equalBeneficiaryPercents(next.length);
                        return { ...f, beneficiaries: next.map((b, i) => ({ ...b, percent: p[i] ?? 0 })) };
                      })
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              <select className={inpCls()} value={b.role} onChange={(e) => setForm((f) => {
                const next = [...f.beneficiaries];
                next[idx] = { ...next[idx], role: e.target.value as "primary" | "contingent" };
                return { ...f, beneficiaries: next };
              })}>
                <option value="primary">Primary</option>
                <option value="contingent">Contingent</option>
              </select>
              <div className="grid sm:grid-cols-3 gap-2">
                <input placeholder="First" className={inpCls()} value={b.firstName} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], firstName: e.target.value }; return { ...f, beneficiaries: n }; })} />
                <input placeholder="Middle" className={inpCls()} value={b.middleName || ""} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], middleName: e.target.value }; return { ...f, beneficiaries: n }; })} />
                <input placeholder="Last" className={inpCls()} value={b.lastName} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], lastName: e.target.value }; return { ...f, beneficiaries: n }; })} />
              </div>
              <div>
                <Label req>Mailing address line 1</Label>
                <input className={inpCls()} value={b.address1} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], address1: e.target.value }; return { ...f, beneficiaries: n }; })} />
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                <div>
                  <Label req>City</Label>
                  <input className={inpCls()} value={b.city} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], city: e.target.value }; return { ...f, beneficiaries: n }; })} />
                </div>
                <div>
                  <Label req>State</Label>
                  <input className={inpCls()} maxLength={2} placeholder="CA" value={b.state} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], state: e.target.value.toUpperCase() }; return { ...f, beneficiaries: n }; })} />
                </div>
                <div>
                  <Label req>ZIP</Label>
                  <input className={inpCls()} value={b.zip} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], zip: e.target.value }; return { ...f, beneficiaries: n }; })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <input placeholder="Phone" className={inpCls()} value={b.phone || ""} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], phone: e.target.value }; return { ...f, beneficiaries: n }; })} />
                <input placeholder="Email" className={inpCls()} value={b.email || ""} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], email: e.target.value }; return { ...f, beneficiaries: n }; })} />
              </div>
              <div>
                <Label req>Relationship to insured</Label>
                <input placeholder="e.g. Spouse, Child" className={inpCls()} value={b.relationship} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], relationship: e.target.value }; return { ...f, beneficiaries: n }; })} />
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                <div>
                  <span className="mb-2 block text-sm font-semibold text-gray-800">SSN / Tax ID (optional)</span>
                  <SensitiveField
                    className={fieldCls}
                    value={b.ssnOrTaxId || ""}
                    onChange={(v) =>
                      setForm((f) => {
                        const n = [...f.beneficiaries];
                        n[idx] = { ...n[idx], ssnOrTaxId: v };
                        return { ...f, beneficiaries: n };
                      })
                    }
                    aria-label={`Beneficiary ${idx + 1} SSN or Tax ID`}
                  />
                </div>
                <div>
                  <Label req>Date of birth</Label>
                  <input type="date" className={inpCls()} value={b.dob} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], dob: e.target.value }; return { ...f, beneficiaries: n }; })} />
                </div>
                <div>
                  <Label req>Share of proceeds (%)</Label>
                  <input type="number" min={0} max={100} placeholder="%" className={inpCls()} value={b.percent} onChange={(e) => setForm((f) => { const n = [...f.beneficiaries]; n[idx] = { ...n[idx], percent: parseFloat(e.target.value) || 0 }; return { ...f, beneficiaries: n }; })} />
                </div>
              </div>
            </div>
          ))}
          {form.beneficiaries.length < 4 && (
            <button
              type="button"
              className="rounded-xl border-2 border-dashed border-brand-purple/30 bg-brand-purple/5 px-5 py-3 text-sm font-semibold text-brand-purple transition hover:border-brand-purple/50 hover:bg-brand-purple/10"
              onClick={() =>
                setForm((f) => {
                  const n = f.beneficiaries.length + 1;
                  const p = equalBeneficiaryPercents(n);
                  return {
                    ...f,
                    beneficiaries: [
                      ...f.beneficiaries.map((b, i) => ({ ...b, percent: p[i] ?? b.percent })),
                      {
                        role: "contingent",
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        address1: "",
                        address2: "",
                        city: "",
                        state: "",
                        zip: "",
                        phone: "",
                        email: "",
                        relationship: "",
                        ssnOrTaxId: "",
                        dob: "",
                        percent: p[n - 1] ?? 0,
                      },
                    ],
                  };
                })
              }
            >
              + Add beneficiary (splits % evenly)
            </button>
          )}
        </section>
      )}

      {step === 5 && (
        <section className="space-y-4 text-sm">
          <h2 className="text-lg font-bold">Section 6 — Medical (Yes/No)</h2>
          {[
            ["q1", "Oxygen, dialysis, wheelchair, hospitalized >2 weeks in past year?"],
            ["q2", "Hospice, nursing home, long-term or memory care?"],
            ["q3", "Terminal illness under 12 months advised?"],
            ["q4", "Pending surgery/tests/specialist referral (12 mo)?"],
            ["q5", "Tobacco/nicotine (12 mo)?"],
          ].map(([k, label]) => (
            <label key={k} className="flex gap-2 items-start">
              <input type="checkbox" checked={form.medical[k as keyof typeof form.medical] as boolean} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, [k]: e.target.checked } }))} />
              <span>{label}</span>
            </label>
          ))}
          <p className="font-semibold pt-2">Past 10 years — diagnosis/treatment/medication for:</p>
          {[
            ["g6a", "Heart/circulatory (CHF, MI, CAD, stroke, TIA, etc.)"],
            ["g6b", "Bipolar, schizophrenia, dementia, Alzheimer’s, memory loss"],
            ["g6c", "Cancer (non-basal), melanoma, brain tumor"],
            ["g6d", "Diabetes with insulin"],
            ["g6e", "COPD / lung disease"],
            ["g6f", "Kidney/liver (CKD, hepatitis, cirrhosis)"],
            ["g6g", "MS, Parkinson’s, epilepsy"],
            ["g6h", "Sickle cell, lupus, ALS, transplant"],
            ["g6i", "Substance abuse or chronic pain + narcotics"],
          ].map(([k, label]) => (
            <label key={k} className="flex gap-2">
              <input type="checkbox" checked={form.medical[k as keyof typeof form.medical] as boolean} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, [k]: e.target.checked } }))} />
              {label}
            </label>
          ))}
          <p className="font-semibold">Additional grouped conditions</p>
          {[
            ["extraHeart", "Other heart rhythm/valve disorder"],
            ["extraCancer", "Other cancer/tumor"],
            ["extraMentalHealth", "Other mental health condition"],
            ["extraRespiratory", "Other respiratory condition"],
            ["extraLiverKidney", "Other liver/kidney condition"],
            ["extraNeurological", "Other neurological condition"],
          ].map(([k, label]) => (
            <label key={k} className="flex gap-2">
              <input type="checkbox" checked={form.medical[k as keyof typeof form.medical] as boolean} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, [k]: e.target.checked } }))} />
              {label}
            </label>
          ))}
          <label className="flex gap-2">
            <input type="checkbox" checked={form.medical.q7} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, q7: e.target.checked } }))} />
            Amputation due to disease
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={form.medical.q8} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, q8: e.target.checked } }))} />
            HIV/AIDS ever diagnosed/tested positive
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Height (ft)</Label>
              <input type="number" className={inpCls()} value={form.medical.heightFeet} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, heightFeet: +e.target.value } }))} />
            </div>
            <div>
              <Label>Height (in)</Label>
              <input type="number" className={inpCls()} value={form.medical.heightInches} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, heightInches: +e.target.value } }))} />
            </div>
            <div>
              <Label>Weight (lbs)</Label>
              <input type="number" className={inpCls()} value={form.medical.weightLbs} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, weightLbs: +e.target.value } }))} />
            </div>
          </div>
          <div>
            <Label>Other health details, surgeries, medications</Label>
            <textarea className={textareaFieldCls()} rows={4} value={form.medical.otherHealthDetails || ""} onChange={(e) => setForm((f) => ({ ...f, medical: { ...f.medical, otherHealthDetails: e.target.value } }))} />
          </div>
        </section>
      )}

      {step === 6 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Banking, physician & employment</h2>
          <p className="rounded-lg border border-brand-purple/15 bg-brand-purple/5 px-4 py-3 text-sm leading-relaxed text-gray-700">
            <strong className="text-gray-900">Privacy:</strong> Account and routing numbers are hidden while you type. The{" "}
            <strong>entire application</strong> is encrypted in your browser before it is sent. Our team only sees decrypted values in the PDF
            generated on our secure server for processing—not in plain text over the internet.
          </p>
          <h3 className="font-semibold">Bank (ACH premium)</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label req>Bank name</Label>
              <input className={inpCls()} value={form.banking.bankName} onChange={(e) => setForm((f) => ({ ...f, banking: { ...f.banking, bankName: e.target.value } }))} />
            </div>
            <div>
              <Label req>Account type</Label>
              <select className={inpCls()} value={form.banking.accountType} onChange={(e) => setForm((f) => ({ ...f, banking: { ...f.banking, accountType: e.target.value as "checking" | "savings" } }))}>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <div>
              <Label req>Routing (9 digits)</Label>
              <SensitiveField
                className={fieldCls}
                maxLength={9}
                inputMode="numeric"
                value={form.banking.routingNumber}
                onChange={(v) =>
                  setForm((f) => ({ ...f, banking: { ...f.banking, routingNumber: v.replace(/\D/g, "").slice(0, 9) } }))
                }
                aria-label="Bank routing number"
              />
            </div>
            <div>
              <Label req>Account number</Label>
              <SensitiveField
                className={fieldCls}
                value={form.banking.accountNumber}
                onChange={(v) => setForm((f) => ({ ...f, banking: { ...f.banking, accountNumber: v } }))}
                aria-label="Bank account number"
              />
            </div>
          </div>
          <h3 className="font-semibold">Treating physician</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label req>First name</Label>
              <input className={inpCls()} value={form.doctor.firstName} onChange={(e) => setForm((f) => ({ ...f, doctor: { ...f.doctor, firstName: e.target.value } }))} />
            </div>
            <div>
              <Label req>Last name</Label>
              <input className={inpCls()} value={form.doctor.lastName} onChange={(e) => setForm((f) => ({ ...f, doctor: { ...f.doctor, lastName: e.target.value } }))} />
            </div>
            <div>
              <Label req>City</Label>
              <input className={inpCls()} value={form.doctor.city} onChange={(e) => setForm((f) => ({ ...f, doctor: { ...f.doctor, city: e.target.value } }))} />
            </div>
            <div className="sm:col-span-3">
              <Label>Phone (optional)</Label>
              <input className={inpCls()} value={form.doctor.phone || ""} onChange={(e) => setForm((f) => ({ ...f, doctor: { ...f.doctor, phone: e.target.value } }))} />
            </div>
          </div>
          <h3 className="font-semibold">Employment</h3>
          <div>
            <Label req>Status</Label>
            <select className={inpCls()} value={form.employment.status} onChange={(e) => setForm((f) => ({ ...f, employment: { ...f.employment, status: e.target.value as ApplyPayload["employment"]["status"] } }))}>
              <option value="employed">Employed</option>
              <option value="selfEmployed">Self-employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
              <option value="homemaker">Homemaker</option>
              <option value="other">Other</option>
            </select>
          </div>
          {(form.employment.status === "employed" || form.employment.status === "selfEmployed") && (
            <div className="grid gap-3">
              <input placeholder="Employer name" className={inpCls()} value={form.employment.employerName || ""} onChange={(e) => setForm((f) => ({ ...f, employment: { ...f.employment, employerName: e.target.value } }))} />
              <input placeholder="Job title" className={inpCls()} value={form.employment.jobTitle || ""} onChange={(e) => setForm((f) => ({ ...f, employment: { ...f.employment, jobTitle: e.target.value } }))} />
              <input placeholder="Annual salary / compensation" className={inpCls()} value={form.employment.annualSalary || ""} onChange={(e) => setForm((f) => ({ ...f, employment: { ...f.employment, annualSalary: e.target.value } }))} />
            </div>
          )}
        </section>
      )}

      {step === 7 && (
        <section className="space-y-4 text-sm">
          <h2 className="text-lg font-bold">Review & legal acknowledgments</h2>
          <p className="text-gray-600">
            This application is not an offer of insurance. Coverage is not bound until approved by the insurer. You may withdraw before acceptance. Health information you provide is used only for underwriting and
            servicing as allowed by law.
          </p>
          <p className="text-gray-600">
            <strong>ACH:</strong> By checking below, you authorize electronic debits from the account provided for premiums on or after the date you selected, subject to your agreement with the carrier and
            NACHA rules. Consult your financial institution regarding stop-payment and dispute rights.
          </p>
          <p className="text-gray-600">
            <strong>Fraud:</strong> Misstatements may void coverage and may be subject to penalties under state law.
          </p>
          <div className="space-y-2">
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.accuracyConfirmed} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, accuracyConfirmed: e.target.checked } }))} />
              I confirm all answers are true and complete to the best of my knowledge.
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.electronicSignatureConsent} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, electronicSignatureConsent: e.target.checked } }))} />
              I consent to sign electronically and receive notices electronically where applicable.
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.notBindingCoverage} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, notBindingCoverage: e.target.checked } }))} />
              I understand submission does not bind coverage until approved and first premium is accepted.
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.achAuthorization} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, achAuthorization: e.target.checked } }))} />
              I authorize ACH debits as described above for premiums.
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.privacyAcknowledged} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, privacyAcknowledged: e.target.checked } }))} />
              I acknowledge the privacy practices described on this site regarding sensitive information.
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.backupWithholdingInsured} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, backupWithholdingInsured: e.target.checked } }))} />
              Insured: IRS notified me I am subject to backup withholding
            </label>
          </div>
          {!form.ownerSameAsInsured && (
            <label className="flex gap-2">
              <input type="checkbox" checked={form.attestations.backupWithholdingOwner} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, backupWithholdingOwner: e.target.checked } }))} />
              Owner: IRS notified me I am subject to backup withholding
            </label>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label req>Typed full legal name (insured)</Label>
              <input className={inpCls()} value={form.attestations.typedSignatureInsured} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, typedSignatureInsured: e.target.value } }))} />
            </div>
            {!form.ownerSameAsInsured && (
              <div>
                <Label>Typed full legal name (owner)</Label>
                <input className={inpCls()} value={form.attestations.typedSignatureOwner || ""} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, typedSignatureOwner: e.target.value } }))} />
              </div>
            )}
            <div>
              <Label req>City signed</Label>
              <input className={inpCls()} value={form.attestations.signedCity} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, signedCity: e.target.value } }))} />
            </div>
            <div>
              <Label req>State</Label>
              <input className={inpCls()} maxLength={2} value={form.attestations.signedState} onChange={(e) => setForm((f) => ({ ...f, attestations: { ...f.attestations, signedState: e.target.value.toUpperCase() } }))} />
            </div>
          </div>
        </section>
      )}

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={step === 0}
            className="order-2 min-h-[48px] rounded-xl px-6 text-base font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 sm:order-1"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="order-1 min-h-[52px] rounded-xl bg-brand-purple px-8 text-base font-semibold text-white shadow-lg shadow-brand-purple/25 transition hover:bg-brand-purple-dark sm:order-2 sm:ml-auto"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={status === "loading"}
              className="order-1 min-h-[52px] rounded-xl bg-brand-purple px-8 text-base font-semibold text-white shadow-lg shadow-brand-purple/25 transition hover:bg-brand-purple-dark disabled:opacity-60 sm:order-2 sm:ml-auto"
              onClick={submit}
            >
              {status === "loading" ? "Encrypting & submitting…" : "Submit encrypted application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
