#!/usr/bin/env node
/**
 * Generates RSA-2048 keypair for Apply Now hybrid encryption.
 *
 * Run: node scripts/generate-apply-keys.mjs
 *
 * Copy the two "KEY=value" lines into `.env.local` (or paste into Vercel env).
 * Redeploy after changing NEXT_PUBLIC_* vars (they are inlined at build time).
 */
import { generateKeyPairSync } from "node:crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const pub = publicKey.trim();
const priv = privateKey.trim();

console.log(`
=== Apply Now — add these to .env.local (or hosting dashboard) ===
Copy the next TWO lines exactly (each is one logical variable assignment):
`);

console.log(`NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM=${JSON.stringify(pub)}`);
console.log(`APPLY_RSA_PRIVATE_KEY_PEM=${JSON.stringify(priv)}`);

console.log(`
Notes:
- Keep the private key only on the server (Vercel Environment Variables, not the client).
- After setting NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM, restart dev server / redeploy so Next.js picks it up.
- Keys must be a matching pair; if you regenerate, update BOTH.
`);
