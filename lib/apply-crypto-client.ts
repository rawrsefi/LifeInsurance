"use client";

import type { EncryptedEnvelope } from "./apply-types";

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----/, "").replace(/-----END PUBLIC KEY-----/, "").replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function encryptPayloadJson(jsonString: string, publicKeyPem: string): Promise<EncryptedEnvelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
  const data = new TextEncoder().encode(jsonString);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv, tagLength: 128 }, aesKey, data);

  const rawAes = await crypto.subtle.exportKey("raw", aesKey);
  const spki = pemToArrayBuffer(publicKeyPem);
  const rsaPub = await crypto.subtle.importKey("spki", spki, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
  const wrappedKey = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, rsaPub, rawAes);

  return {
    alg: "A256GCM-RSA-OAEP-256",
    wrappedKey: btoa(String.fromCharCode(...new Uint8Array(wrappedKey))),
    iv: btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  };
}
