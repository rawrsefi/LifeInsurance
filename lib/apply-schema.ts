import { z } from "zod";

export const beneficiarySchema = z.object({
  role: z.enum(["primary", "contingent"]),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip: z.string().min(3),
  phone: z.string().optional(),
  email: z.string().optional(),
  relationship: z.string().min(1),
  ssnOrTaxId: z.string().optional(),
  dob: z.string().min(1),
  percent: z.coerce.number().min(0).max(100),
});

export const contractSchema = z.object({
  contractNumber: z.string().optional(),
  faceAmount: z.string().optional(),
  planOfInsurance: z.string().optional(),
  existingOrApplied: z.enum(["existing", "applied"]).optional(),
  yearOfIssue: z.string().optional(),
  replacing: z.boolean().optional(),
});

export const applyPayloadSchema = z
  .object({
    insured: z.object({
      firstName: z.string().min(1),
      middleName: z.string().optional(),
      lastName: z.string().min(1),
      address1: z.string().min(1),
      address2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(2).max(2),
      zip: z.string().min(3),
      sex: z.enum(["F", "M"]),
      dob: z.string().min(1),
      birthStateOrCountry: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(7),
      phoneType: z.enum(["D", "S"]).optional(),
      usCitizen: z.boolean(),
      legalUsResident: z.boolean().optional(),
      felonyConviction: z.boolean(),
      ssnOrTaxId: z.string().min(4),
      driversLicenseOrStateId: z.string().min(1),
      trustedContact: z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        phone: z.string().min(7),
        email: z.string().optional(),
        relationship: z.string().min(1),
      }),
      secondaryAddressee: z.object({
        wantsCopy: z.boolean(),
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        phone: z.string().optional(),
      }),
    }),
    ownerSameAsInsured: z.boolean(),
    owner: z
      .object({
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        sex: z.enum(["F", "M"]).optional(),
        dob: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        relationshipToInsured: z.string().optional(),
        usCitizen: z.boolean().optional(),
        legalUsResident: z.boolean().optional(),
        ssnOrTaxId: z.string().optional(),
      })
      .optional(),
    coverage: z.object({
      paymentMode: z.enum(["monthly", "quarterly", "semiAnnual", "annual"]),
      premiumWithApplication: z.string().optional(),
      faceAmount: z.string().min(1),
      plan: z.enum(["level", "graded", "guaranteedIssue"]),
      acceptModifiedPlan: z.boolean(),
      nonforfeiture: z.enum(["cashSurrender", "reducedPaidUp", "extendedTerm"]).optional(),
      aplNotDesired: z.boolean().optional(),
      dividendOption: z.string().optional(),
      riders: z.object({
        acceleratedDeathBenefit: z.boolean(),
        grandchild: z.boolean(),
        accidentalDeathBenefit: z.boolean(),
        accidentalDeathFaceAmount: z.string().optional(),
        charitableGiving: z.boolean(),
        charityName: z.string().optional(),
      }),
      achWithdrawalDate: z.string().min(1),
      achWithdrawalDayOfMonth: z.coerce.number().min(1).max(28).optional(),
    }),
    otherInsurance: z.object({
      hasRoyalNeighbors: z.boolean(),
      rnContracts: z.array(contractSchema).max(2),
      hasOtherCompanies: z.boolean(),
      otherContracts: z
        .array(
          contractSchema.extend({
            insuranceCompany: z.string().optional(),
          })
        )
        .max(2),
      replacementDisclosure: z.boolean(),
      replacementNote: z.string().optional(),
    }),
    beneficiaries: z.array(beneficiarySchema).min(1).max(4),
    medical: z.object({
      q1: z.boolean(),
      q2: z.boolean(),
      q3: z.boolean(),
      q4: z.boolean(),
      q5: z.boolean(),
      g6a: z.boolean(),
      g6b: z.boolean(),
      g6c: z.boolean(),
      g6d: z.boolean(),
      g6e: z.boolean(),
      g6f: z.boolean(),
      g6g: z.boolean(),
      g6h: z.boolean(),
      g6i: z.boolean(),
      extraHeart: z.boolean(),
      extraCancer: z.boolean(),
      extraMentalHealth: z.boolean(),
      extraRespiratory: z.boolean(),
      extraLiverKidney: z.boolean(),
      extraNeurological: z.boolean(),
      q7: z.boolean(),
      q8: z.boolean(),
      heightFeet: z.coerce.number().min(3).max(8),
      heightInches: z.coerce.number().min(0).max(11),
      weightLbs: z.coerce.number().min(50).max(600),
      otherHealthDetails: z.string().optional(),
    }),
    banking: z.object({
      bankName: z.string().min(1),
      routingNumber: z.string().min(9).max(9),
      accountNumber: z.string().min(4),
      accountType: z.enum(["checking", "savings"]),
    }),
    doctor: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      city: z.string().min(1),
      phone: z.string().optional(),
    }),
    employment: z.object({
      status: z.enum(["employed", "selfEmployed", "unemployed", "retired", "student", "homemaker", "other"]),
      employerName: z.string().optional(),
      annualSalary: z.string().optional(),
      jobTitle: z.string().optional(),
    }),
    attestations: z.object({
      accuracyConfirmed: z.boolean(),
      electronicSignatureConsent: z.boolean(),
      notBindingCoverage: z.boolean(),
      achAuthorization: z.boolean(),
      privacyAcknowledged: z.boolean(),
      backupWithholdingInsured: z.boolean(),
      backupWithholdingOwner: z.boolean(),
      signedCity: z.string().min(1),
      signedState: z.string().min(2).max(2),
      typedSignatureInsured: z.string().min(1),
      typedSignatureOwner: z.string().optional(),
    }),
    submittedAt: z.string(),
  })
  .superRefine((data, ctx) => {
    const a = data.attestations;
    if (!a.accuracyConfirmed || !a.electronicSignatureConsent || !a.notBindingCoverage || !a.achAuthorization || !a.privacyAcknowledged) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All required attestations must be accepted",
        path: ["attestations"],
      });
    }
    if (!data.ownerSameAsInsured) {
      const o = data.owner;
      if (!o?.firstName || !o?.lastName || !o?.address1 || !o?.city || !o?.state || !o?.zip || !o?.relationshipToInsured) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Owner details required when owner differs from insured", path: ["owner"] });
      }
    }
    if (data.employment.status === "employed" || data.employment.status === "selfEmployed") {
      if (!data.employment.employerName?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Employer name required", path: ["employment", "employerName"] });
      }
      if (!data.employment.annualSalary?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Annual compensation required", path: ["employment", "annualSalary"] });
      }
      if (!data.employment.jobTitle?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Job title required", path: ["employment", "jobTitle"] });
      }
    }
    if (data.insured.secondaryAddressee.wantsCopy) {
      const s = data.insured.secondaryAddressee;
      if (!s.firstName || !s.lastName || !s.address1 || !s.city || !s.state || !s.zip) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Secondary addressee address required", path: ["insured", "secondaryAddressee"] });
      }
    }
    const total = data.beneficiaries.reduce((sum, b) => sum + b.percent, 0);
    if (Math.abs(total - 100) > 0.01) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Beneficiary percentages must total 100%", path: ["beneficiaries"] });
    }
  });

export type ApplyPayload = z.infer<typeof applyPayloadSchema>;
