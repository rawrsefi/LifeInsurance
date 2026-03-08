import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, coverageType, message } = body;

    if (!name || !email || !coverageType) {
      return NextResponse.json({ error: "Name, email, and coverage type are required." }, { status: 400 });
    }

    // When Resend API key is configured, uncomment below:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'AEG Website <noreply@aeginsurance.com>',
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `New Quote Request: ${coverageType} - ${name}`,
    //   html: `
    //     <h2>New Quote Request from AEG Website</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    //     <p><strong>Coverage Type:</strong> ${coverageType}</p>
    //     <p><strong>Message:</strong> ${message || 'No message'}</p>
    //   `,
    // });

    console.log("Quote request received:", { name, email, phone, coverageType, message });

    return NextResponse.json({ success: true, message: "Your request has been received. We will contact you within 24 hours." });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
