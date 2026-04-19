import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { ApplyPayload } from "./apply-schema";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_W = PAGE_WIDTH - 2 * MARGIN;
const INDENT = 14;
const GAP_AFTER_SECTION = 18;
const GAP_AFTER_BLOCK = 10;
const LINE_FOOTER = 9;

const COL_TEXT = rgb(0.14, 0.14, 0.16);
const COL_MUTED = rgb(0.38, 0.38, 0.42);
const COL_PURPLE = rgb(0.49, 0.23, 0.93);
const COL_BAND_BG = rgb(0.96, 0.94, 0.99);
const COL_BAND_BORDER = rgb(0.85, 0.82, 0.92);
const COL_HEADER_BG = rgb(0.49, 0.23, 0.93);

function wrapByWidth(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) cur = test;
    else {
      if (cur) lines.push(cur);
      if (font.widthOfTextAtSize(w, size) <= maxWidth) cur = w;
      else {
        let chunk = w;
        while (chunk.length > 0) {
          let lo = 1;
          let hi = chunk.length;
          let best = 1;
          while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            const sub = chunk.slice(0, mid);
            if (font.widthOfTextAtSize(sub, size) <= maxWidth) {
              best = mid;
              lo = mid + 1;
            } else hi = mid - 1;
          }
          lines.push(chunk.slice(0, best));
          chunk = chunk.slice(best);
        }
        cur = "";
      }
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function lineHeight(size: number) {
  return Math.ceil(size * 1.35);
}

type Layout = {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  font: PDFFont;
  bold: PDFFont;
};

export async function generateApplicationPdf(data: ApplyPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const layout: Layout = {
    doc,
    page: doc.getPage(0),
    y: PAGE_HEIGHT - MARGIN,
    font,
    bold,
  };

  const ensure = (minHeight: number) => {
    if (layout.y - minHeight < MARGIN + 36) {
      layout.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      layout.y = PAGE_HEIGHT - MARGIN;
    }
  };

  const textLines = (lines: string[], size: number, f: PDFFont, color = COL_TEXT, x: number = MARGIN) => {
    const lh = lineHeight(size);
    for (const line of lines) {
      ensure(lh + 2);
      layout.page.drawText(line, { x, y: layout.y, size, font: f, color });
      layout.y -= lh;
    }
  };

  const paragraph = (body: string, size = 10, color = COL_TEXT) => {
    textLines(wrapByWidth(body, font, size, CONTENT_W), size, font, color);
  };

  const keyValue = (label: string, value: string, valueSize = 10) => {
    const labelSize = 8.5;
    ensure(lineHeight(labelSize) + 4);
    layout.page.drawText(label.toUpperCase(), {
      x: MARGIN,
      y: layout.y,
      size: labelSize,
      font: bold,
      color: COL_MUTED,
    });
    layout.y -= lineHeight(labelSize) + 2;
    const valLines = wrapByWidth(value, font, valueSize, CONTENT_W - INDENT);
    textLines(valLines, valueSize, font, COL_TEXT, MARGIN + INDENT);
    layout.y -= 4;
  };

  const spacer = (pts: number) => {
    layout.y -= pts;
  };

  const section = (num: string, title: string) => {
    spacer(GAP_AFTER_SECTION);
    const bandH = 26;
    ensure(bandH + 12);
    layout.page.drawRectangle({
      x: MARGIN,
      y: layout.y - bandH,
      width: CONTENT_W,
      height: bandH,
      color: COL_BAND_BG,
      borderColor: COL_BAND_BORDER,
      borderWidth: 0.75,
    });
    layout.page.drawText(`${num}`, {
      x: MARGIN + 10,
      y: layout.y - 17,
      size: 9,
      font,
      color: COL_PURPLE,
    });
    const titleText = title;
    layout.page.drawText(titleText, {
      x: MARGIN + 36,
      y: layout.y - 17,
      size: 12,
      font: bold,
      color: COL_PURPLE,
    });
    layout.y -= bandH + GAP_AFTER_BLOCK;
  };

  // —— Cover header ——
  const headerH = 72;
  ensure(headerH + 8);
  layout.page.drawRectangle({
    x: MARGIN,
    y: layout.y - headerH,
    width: CONTENT_W,
    height: headerH,
    color: COL_HEADER_BG,
  });
  layout.page.drawText("Assurity Enterprise Group", {
    x: MARGIN + 16,
    y: layout.y - 28,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  layout.page.drawText("Life insurance — application summary", {
    x: MARGIN + 16,
    y: layout.y - 48,
    size: 11,
    font,
    color: rgb(0.95, 0.92, 1),
  });
  const gen = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  layout.page.drawText(`Generated (server): ${gen}`, {
    x: MARGIN + 16,
    y: layout.y - 64,
    size: 8.5,
    font,
    color: rgb(0.9, 0.85, 1),
  });
  layout.y -= headerH + 20;

  keyValue("Submitted at (as entered)", data.submittedAt, 9);

  // —— Insured ——
  section("1", "Proposed insured");
  const i = data.insured;
  keyValue("Legal name", `${i.firstName} ${i.middleName ? `${i.middleName} ` : ""}${i.lastName}`);
  keyValue(
    "Mailing address",
    `${i.address1}${i.address2 ? `, ${i.address2}` : ""} — ${i.city}, ${i.state} ${i.zip}`,
  );
  keyValue("Sex / Date of birth", `${i.sex === "M" ? "Male" : "Female"} / ${i.dob}`);
  keyValue("State or country of birth", i.birthStateOrCountry);
  keyValue("Email", i.email);
  keyValue("Phone", i.phone);
  keyValue(
    "Citizenship & residency",
    `U.S. citizen: ${i.usCitizen ? "Yes" : "No"}${i.legalUsResident != null ? ` — Legal U.S. resident (if not citizen): ${i.legalUsResident ? "Yes" : "No"}` : ""}`,
  );
  keyValue("Felony conviction (as disclosed)", i.felonyConviction ? "Yes" : "No");
  keyValue("SSN / Tax ID", i.ssnOrTaxId);
  keyValue("Driver license or state ID", i.driversLicenseOrStateId);
  keyValue(
    "Trusted contact",
    `${i.trustedContact.name} — ${i.trustedContact.relationship}. Address: ${i.trustedContact.address}. Phone: ${i.trustedContact.phone}${i.trustedContact.email ? `. Email: ${i.trustedContact.email}` : ""}`,
  );
  if (i.secondaryAddressee.wantsCopy) {
    const s = i.secondaryAddressee;
    keyValue(
      "Secondary addressee (copy of communications)",
      `${s.firstName} ${s.lastName}${s.address1 ? ` — ${s.address1}` : ""}${s.address2 ? `, ${s.address2}` : ""}${s.city ? ` — ${s.city}, ${s.state} ${s.zip}` : ""}${s.phone ? ` — Phone: ${s.phone}` : ""}`,
    );
  }

  if (!data.ownerSameAsInsured && data.owner && data.owner.firstName) {
    section("2", "Owner (other than insured)");
    const o = data.owner;
    keyValue("Legal name", `${o.firstName} ${o.middleName ? `${o.middleName} ` : ""}${o.lastName ?? ""}`);
    keyValue(
      "Address",
      `${o.address1 ?? ""}${o.address2 ? `, ${o.address2}` : ""} — ${o.city}, ${o.state} ${o.zip}`,
    );
    if (o.relationshipToInsured) keyValue("Relationship to insured", o.relationshipToInsured);
    if (o.ssnOrTaxId) keyValue("SSN / Tax ID", o.ssnOrTaxId);
  }

  section("3", "Coverage & payment");
  const c = data.coverage;
  keyValue("Payment mode", c.paymentMode);
  if (c.premiumWithApplication) keyValue("Premium with application", c.premiumWithApplication);
  keyValue("Face amount", c.faceAmount);
  keyValue("Plan type", c.plan);
  keyValue("Accept modified plan if offered", c.acceptModifiedPlan ? "Yes" : "No");
  if (c.nonforfeiture) keyValue("Nonforfeiture option", c.nonforfeiture);
  if (c.aplNotDesired != null) keyValue("APL not desired", c.aplNotDesired ? "Yes" : "No");
  if (c.dividendOption) keyValue("Dividend option", c.dividendOption);
  keyValue(
    "ACH / withdrawal timing",
    `Preferred date: ${c.achWithdrawalDate}${c.achWithdrawalDayOfMonth != null ? ` — Day of month: ${c.achWithdrawalDayOfMonth}` : ""}`,
  );
  keyValue(
    "Riders",
    [
      `Accelerated death benefit: ${c.riders.acceleratedDeathBenefit ? "Yes" : "No"}`,
      `Grandchild: ${c.riders.grandchild ? "Yes" : "No"}`,
      `Accidental death: ${c.riders.accidentalDeathBenefit ? "Yes" : "No"}${c.riders.accidentalDeathFaceAmount ? ` (face: ${c.riders.accidentalDeathFaceAmount})` : ""}`,
      `Charitable giving: ${c.riders.charitableGiving ? "Yes" : "No"}${c.riders.charityName ? ` — ${c.riders.charityName}` : ""}`,
    ].join(" · "),
  );

  section("4", "Other insurance");
  const oi = data.otherInsurance;
  keyValue("Existing / applied — Royal Neighbors", oi.hasRoyalNeighbors ? "Yes" : "No");
  if (oi.rnContracts?.length) {
    oi.rnContracts.forEach((ct, idx) => {
      keyValue(
        `RN contract ${idx + 1}`,
        [ct.contractNumber, ct.faceAmount, ct.planOfInsurance, ct.yearOfIssue, ct.existingOrApplied, ct.replacing != null ? `Replacing: ${ct.replacing}` : ""]
          .filter(Boolean)
          .join(" · "),
      );
    });
  }
  keyValue("Other companies (non-RN)", oi.hasOtherCompanies ? "Yes" : "No");
  if (oi.otherContracts?.length) {
    oi.otherContracts.forEach((ct, idx) => {
      keyValue(
        `Other carrier contract ${idx + 1}`,
        [ct.insuranceCompany, ct.contractNumber, ct.faceAmount, ct.planOfInsurance].filter(Boolean).join(" · "),
      );
    });
  }
  keyValue("Replacement disclosure indicated", oi.replacementDisclosure ? "Yes" : "No");
  if (oi.replacementNote) keyValue("Replacement notes", oi.replacementNote);

  section("5", "Beneficiaries");
  data.beneficiaries.forEach((b, idx) => {
    spacer(6);
    keyValue(
      `Beneficiary ${idx + 1} (${b.role})`,
      `${b.firstName} ${b.middleName ? `${b.middleName} ` : ""}${b.lastName} — ${b.percent}%`,
    );
    keyValue("Address", `${b.address1}${b.address2 ? `, ${b.address2}` : ""} — ${b.city}, ${b.state} ${b.zip}`);
    keyValue("Phone / Email", [b.phone, b.email].filter(Boolean).join(" · ") || "—");
    keyValue("Relationship / DOB", `${b.relationship} — DOB ${b.dob}`);
    if (b.ssnOrTaxId) keyValue("SSN / Tax ID", b.ssnOrTaxId);
  });

  section("6", "Medical & build");
  const m = data.medical;
  const yn = (v: boolean) => (v ? "Yes" : "No");
  keyValue(
    "General questions (Q1–Q5)",
    `Q1: ${yn(m.q1)} · Q2: ${yn(m.q2)} · Q3: ${yn(m.q3)} · Q4: ${yn(m.q4)} · Q5: ${yn(m.q5)}`,
  );
  keyValue(
    "Condition groups 6a–6i",
    `6a Heart/circulatory: ${yn(m.g6a)} · 6b Psychiatric/cognitive: ${yn(m.g6b)} · 6c Cancer: ${yn(m.g6c)} · 6d Diabetes (insulin): ${yn(m.g6d)} · 6e COPD/lung: ${yn(m.g6e)} · 6f Kidney/liver: ${yn(m.g6f)} · 6g MS/Parkinson’s/epilepsy: ${yn(m.g6g)} · 6h Sickle cell/lupus/ALS/transplant: ${yn(m.g6h)} · 6i Substance/pain meds: ${yn(m.g6i)}`,
  );
  keyValue(
    "Additional toggles",
    `Other heart: ${yn(m.extraHeart)} · Other cancer/tumor: ${yn(m.extraCancer)} · Other mental health: ${yn(m.extraMentalHealth)} · Other respiratory: ${yn(m.extraRespiratory)} · Other liver/kidney: ${yn(m.extraLiverKidney)} · Other neurological: ${yn(m.extraNeurological)}`,
  );
  keyValue("Q7 Amputation (disease)", yn(m.q7));
  keyValue("Q8 HIV/AIDS", yn(m.q8));
  keyValue("Height / weight", `${m.heightFeet}' ${m.heightInches}" — ${m.weightLbs} lbs`);
  if (m.otherHealthDetails?.trim()) keyValue("Additional health details", m.otherHealthDetails.trim());

  section("7", "Banking (premium draft)");
  const bk = data.banking;
  keyValue("Financial institution", bk.bankName);
  keyValue("Account type", bk.accountType);
  keyValue("Routing number", bk.routingNumber);
  keyValue("Account number", bk.accountNumber);

  section("8", "Treating physician");
  const d = data.doctor;
  keyValue("Physician", `${d.firstName} ${d.lastName} — ${d.city}${d.phone ? ` — ${d.phone}` : ""}`);

  section("9", "Employment");
  const e = data.employment;
  keyValue("Status", e.status);
  if (e.employerName) keyValue("Employer", e.employerName);
  if (e.jobTitle) keyValue("Job title", e.jobTitle);
  if (e.annualSalary) keyValue("Annual compensation (as stated)", e.annualSalary);

  section("10", "Signatures & attestations");
  const a = data.attestations;
  keyValue("Signed at (city, state)", `${a.signedCity}, ${a.signedState}`);
  keyValue("Typed signature — insured", a.typedSignatureInsured);
  if (a.typedSignatureOwner) keyValue("Typed signature — owner", a.typedSignatureOwner);
  keyValue(
    "Confirmations",
    [
      `Accuracy: ${a.accuracyConfirmed ? "Yes" : "No"}`,
      `E-sign consent: ${a.electronicSignatureConsent ? "Yes" : "No"}`,
      `Not binding until approved: ${a.notBindingCoverage ? "Yes" : "No"}`,
      `ACH authorization: ${a.achAuthorization ? "Yes" : "No"}`,
      `Privacy acknowledged: ${a.privacyAcknowledged ? "Yes" : "No"}`,
    ].join(" · "),
  );
  keyValue(
    "Backup withholding notices",
    `Insured: ${a.backupWithholdingInsured ? "Notified" : "N/A"} · Owner: ${a.backupWithholdingOwner ? "Notified" : "N/A"}`,
  );

  spacer(16);
  ensure(lineHeight(9) * 3);
  paragraph(
    "This document summarizes information you submitted. Coverage is not bound until approved by the insurer. For internal processing use.",
    9,
    COL_MUTED,
  );

  const pages = doc.getPages();
  const total = pages.length;
  pages.forEach((p, idx) => {
    const footer = `AEG Application Summary · Page ${idx + 1} of ${total}`;
    p.drawText(footer, {
      x: MARGIN,
      y: MARGIN + 10,
      size: LINE_FOOTER,
      font,
      color: COL_MUTED,
    });
  });

  return doc.save();
}
