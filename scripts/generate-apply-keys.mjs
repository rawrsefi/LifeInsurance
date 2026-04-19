#!/usr/bin/env node
/**
 * Generates RSA-2048 keypair for Apply Now hybrid encryption.
 * Run: node scripts/generate-apply-keys.mjs
 * Add private key to APPLY_RSA_PRIVATE_KEY_PEM (Vercel env, multiline or base64-wrap).
 * Add public key to NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM (single line with \n escaped or use env file).
 */
import { generateKeyPairSync } from "node:crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

console.log("--- NEXT_PUBLIC_APPLY_RSA_PUBLIC_KEY_PEM (paste in .env.local) ---\n");
console.log(JSON.stringify(publicKey.trim()));
console.log("\n--- APPLY_RSA_PRIVATE_KEY_PEM (server only; never commit plaintext to git) ---\n");
console.log(JSON.stringify(privateKey.trim()));
