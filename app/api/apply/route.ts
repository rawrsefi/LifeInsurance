import { NextResponse } from "next/server";
import { Resend } from "resend";
import { decryptEnvelope } from "@/lib/apply-crypto";
import { applyPayloadSchema } from "@/lib/apply-schema";
import { generateApplicationPdf } from "@/lib/generate-application-pdf";
import type { EncryptedEnvelope } from "@/lib/apply-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const privateKey = process.env.APPLY_RSA_PRIVATE_KEY_PEM;
    if (!privateKey) {
      return NextResponse.json({ error: "Server encryption is not configured." }, { status: 503 });
    }

    const body = (await request.json()) as EncryptedEnvelope;
    if (!body?.wrappedKey || !body?.iv || !body?.ciphertext || body.alg !== "A256GCM-RSA-OAEP-256") {
      return NextResponse.json({ error: "Invalid encrypted payload." }, { status: 400 });
    }

    let json: string;
    try {
      json = decryptEnvelope(body, privateKey.replace(/\\n/g, "\n"));
    } catch {
      return NextResponse.json({ error: "Could not decrypt application. Check keys match." }, { status: 400 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return NextResponse.json({ error: "Invalid JSON after decrypt." }, { status: 400 });
    }

    const data = applyPayloadSchema.safeParse(parsed);
    if (!data.success) {
      const issues = data.error.issues.map((i) => ({
        path: i.path.length ? i.path.join(".") : "form",
        message: i.message,
      }));
      return NextResponse.json(
        {
          error: "Validation failed. Check the highlighted fields and try again.",
          issues,
          details: data.error.flatten(),
        },
        { status: 400 }
      );
    }

    const pdfBytes = await generateApplicationPdf(data.data);
    const last = data.data.insured.lastName.replace(/[^\w-]/g, "") || "application";
    const filename = `AEG-application-${last}-${Date.now()}.pdf`;

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.APPLY_EMAIL || process.env.CONTACT_EMAIL;

    if (resendKey && to) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM || "AEG Applications <onboarding@resend.dev>",
        to: [to],
        subject: `New application — ${data.data.insured.firstName} ${data.data.insured.lastName}`,
        html: `<p>A new encrypted application was submitted and decrypted server-side.</p><p><strong>Insured:</strong> ${data.data.insured.firstName} ${data.data.insured.lastName}</p><p>PDF is attached.</p>`,
        attachments: [{ filename, content: Buffer.from(pdfBytes) }],
      });
    } else {
      console.warn("apply: RESEND_API_KEY or APPLY_EMAIL/CONTACT_EMAIL missing; PDF not emailed.");
    }

    return NextResponse.json({ success: true, message: "Application received." });
  } catch (e) {
    console.error("apply error", e);
    return NextResponse.json({ error: "Processing failed. Please try again later." }, { status: 500 });
  }
}
