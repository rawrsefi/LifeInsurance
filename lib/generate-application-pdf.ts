import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ApplyPayload } from "./apply-schema";

const MARGIN = 48;
const LINE = 14;
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w.length > maxChars ? w.slice(0, maxChars) : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

export async function generateApplicationPdf(data: ApplyPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  const maxW = Math.floor((PAGE_WIDTH - 2 * MARGIN) / 6.5);

  const addLine = (text: string, size = 10, isBold = false) => {
    const f = isBold ? bold : font;
    for (const line of wrapText(text, maxW)) {
      if (y < MARGIN + 40) {
        page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
      page.drawText(line, { x: MARGIN, y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
      y -= LINE;
    }
  };

  const section = (title: string) => {
    y -= 6;
    addLine(title, 12, true);
    y -= 4;
  };

  addLine("Assurity Enterprise Group — Life Insurance Application Summary", 14, true);
  addLine(`Generated: ${new Date().toISOString()}`, 9, false);
  addLine(`Submitted at (client): ${data.submittedAt}`, 9, false);
  y -= 8;

  section("SECTION 1 — Proposed Insured");
  const i = data.insured;
  addLine(`Name: ${i.firstName} ${i.middleName || ""} ${i.lastName}`);
  addLine(`Address: ${i.address1}${i.address2 ? `, ${i.address2}` : ""}`);
  addLine(`${i.city}, ${i.state} ${i.zip}`);
  addLine(`Sex: ${i.sex}  DOB: ${i.dob}  Birth (state/country): ${i.birthStateOrCountry}`);
  addLine(`Email: ${i.email}  Phone: ${i.phone}`);
  addLine(`U.S. citizen: ${i.usCitizen ? "Yes" : "No"}  Legal U.S. resident (if not citizen): ${i.legalUsResident ?? "N/A"}`);
  addLine(`Felony conviction: ${i.felonyConviction ? "Yes" : "No"}`);
  addLine(`SSN / Tax ID: ${i.ssnOrTaxId}`);
  addLine(`Driver license / State ID: ${i.driversLicenseOrStateId}`);
  addLine(`Trusted contact: ${i.trustedContact.name} | ${i.trustedContact.address} | ${i.trustedContact.phone} | ${i.trustedContact.email || ""} | ${i.trustedContact.relationship}`);
  if (i.secondaryAddressee.wantsCopy) {
    addLine(`Secondary addressee: ${i.secondaryAddressee.firstName} ${i.secondaryAddressee.lastName} ${i.secondaryAddressee.address1 || ""} ${i.secondaryAddressee.city || ""} ${i.secondaryAddressee.state || ""} ${i.secondaryAddressee.zip || ""} Phone: ${i.secondaryAddressee.phone || ""}`);
  }

  if (!data.ownerSameAsInsured && data.owner && data.owner.firstName) {
    section("SECTION 2 — Owner (other than insured)");
    const o = data.owner;
    addLine(`Name: ${o.firstName} ${o.lastName}`);
    addLine(`Address: ${o.address1} ${o.city} ${o.state} ${o.zip}`);
    addLine(`Relationship to insured: ${o.relationshipToInsured}`);
    addLine(`SSN/Tax ID: ${o.ssnOrTaxId || "N/A"}`);
  }

  section("SECTION 3 — Coverage & payment");
  const c = data.coverage;
  addLine(`Payment mode: ${c.paymentMode}  Face amount: ${c.faceAmount}`);
  addLine(`Plan: ${c.plan}  Accept modified plan: ${c.acceptModifiedPlan ? "Yes" : "No"}`);
  addLine(`ACH withdrawal preference date: ${c.achWithdrawalDate}${c.achWithdrawalDayOfMonth != null ? ` (day of month: ${c.achWithdrawalDayOfMonth})` : ""}`);
  addLine(`Riders: ADB ${c.riders.acceleratedDeathBenefit}, Grandchild ${c.riders.grandchild}, AD ${c.riders.accidentalDeathBenefit} ${c.riders.accidentalDeathFaceAmount || ""}, Charity ${c.riders.charitableGiving} ${c.riders.charityName || ""}`);

  section("SECTION 4 — Other insurance");
  const oi = data.otherInsurance;
  addLine(`Royal Neighbors contracts: ${oi.hasRoyalNeighbors ? "Yes" : "No"}`);
  addLine(`Other companies: ${oi.hasOtherCompanies ? "Yes" : "No"}`);
  addLine(`Replacement disclosure: ${oi.replacementDisclosure ? "Yes" : "No"} ${oi.replacementNote || ""}`);

  section("SECTION 5 — Beneficiaries");
  data.beneficiaries.forEach((b, idx) => {
    addLine(`${idx + 1}. ${b.role.toUpperCase()} — ${b.firstName} ${b.lastName} (${b.percent}%)`);
    addLine(`   ${b.address1} ${b.city}, ${b.state} ${b.zip} | Phone: ${b.phone || ""} | Email: ${b.email || ""}`);
    addLine(`   Relationship: ${b.relationship} | DOB: ${b.dob} | SSN/Tax ID: ${b.ssnOrTaxId || ""}`);
  });

  section("SECTION 6 — Medical");
  const m = data.medical;
  addLine(`Q1-Q5: ${[m.q1, m.q2, m.q3, m.q4, m.q5].map((x) => (x ? "Y" : "N")).join(" ")}`);
  addLine(`6a-6i: ${[m.g6a, m.g6b, m.g6c, m.g6d, m.g6e, m.g6f, m.g6g, m.g6h, m.g6i].map((x) => (x ? "Y" : "N")).join(" ")}`);
  addLine(`Extra groups: heart ${m.extraHeart}, cancer ${m.extraCancer}, mental ${m.extraMentalHealth}, lung ${m.extraRespiratory}, liver/kidney ${m.extraLiverKidney}, neuro ${m.extraNeurological}`);
  addLine(`Q7 amputation: ${m.q7 ? "Yes" : "No"}  Q8 HIV: ${m.q8 ? "Yes" : "No"}`);
  addLine(`Height: ${m.heightFeet}' ${m.heightInches}"  Weight: ${m.weightLbs} lbs`);
  if (m.otherHealthDetails) addLine(`Other health details: ${m.otherHealthDetails}`);

  section("Banking (premium / ACH)");
  const bk = data.banking;
  addLine(`Bank: ${bk.bankName}  Type: ${bk.accountType}`);
  addLine(`Routing: ${bk.routingNumber}  Account: ${bk.accountNumber}`);

  section("Treating physician");
  const d = data.doctor;
  addLine(`${d.firstName} ${d.lastName}, ${d.city}${d.phone ? ` | ${d.phone}` : ""}`);

  section("Employment");
  const e = data.employment;
  addLine(`Status: ${e.status}`);
  if (e.employerName) addLine(`Employer: ${e.employerName} | Title: ${e.jobTitle || ""} | Annual: ${e.annualSalary || ""}`);

  section("Signatures & attestations");
  const a = data.attestations;
  addLine(`Signed at: ${a.signedCity}, ${a.signedState}`);
  addLine(`Typed signature (insured): ${a.typedSignatureInsured}`);
  if (a.typedSignatureOwner) addLine(`Typed signature (owner): ${a.typedSignatureOwner}`);
  addLine(`Backup withholding (insured): ${a.backupWithholdingInsured ? "Notified" : "No"}  (owner): ${a.backupWithholdingOwner ? "Notified" : "No"}`);

  y -= 12;
  addLine("This summary is for internal processing. Coverage is not bound until approved by the insurer.", 9, true);

  const pdfBytes = await doc.save();
  return pdfBytes;
}
