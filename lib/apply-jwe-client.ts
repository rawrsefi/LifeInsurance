"use client";

import { CompactEncrypt, importSPKI } from "jose";

/**
 * Standard JWE (RFC 7516) compact serialization: RSA-OAEP-256 key wrap + A256GCM content encryption.
 * Same RSA keypair as before; wire format is interoperable and library-audited (jose).
 */
export async function encryptApplicationJwe(jsonUtf8: string, publicKeyPem: string): Promise<string> {
  const pem = publicKeyPem.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
  const publicKey = await importSPKI(pem, "RSA-OAEP-256");
  return await new CompactEncrypt(new TextEncoder().encode(jsonUtf8))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(publicKey);
}
