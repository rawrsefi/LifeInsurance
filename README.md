This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Apply Now (encrypted submissions)

The `/apply` flow posts a **hybrid-encrypted** payload (AES-256-GCM + RSA-OAEP). Configure:

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM` | Client (build-time) | RSA public key (PEM) used in the browser to wrap the AES key. |
| `APPLY_RSA_PRIVATE_KEY_PEM` | Server only | RSA private key (PEM) to unwrap and decrypt on `POST /api/apply`. Never commit. In Vercel/host env, newlines are often escaped as `\n`; the API normalizes `\\n` to real newlines. |
| `RESEND_API_KEY` | Server | Resend API key for email. |
| `APPLY_EMAIL` or `CONTACT_EMAIL` | Server | Recipient for application PDFs. |
| `RESEND_FROM` | Server (optional) | From address (must be verified in Resend). |

Generate a key pair locally:

```bash
node scripts/generate-apply-keys.mjs
```

Copy the printed PEM strings into your `.env.local` (public) and hosting secrets (private). Rotate keys periodically and redeploy with a new pair.

### SEO / EEAT (optional)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_ORG_SAME_AS` | Comma-separated HTTPS URLs (e.g. LinkedIn, BBB) for Organization `sameAs` in JSON-LD. |
| `NEXT_PUBLIC_DEFAULT_REVIEWER_NAME` | Blog byline name (defaults to AEG Editorial Team). |
| `NEXT_PUBLIC_DEFAULT_REVIEWER_CREDENTIAL` | Short credential line for blog bylines. |

Static [`public/llms.txt`](public/llms.txt) lists canonical URLs for AI crawlers that support it.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
