import * as crypto from "node:crypto";
import type { EncryptedEnvelope } from "./apply-types";

export type { EncryptedEnvelope } from "./apply-types";

const TAG_LENGTH = 16;

export function decryptEnvelope(envelope: EncryptedEnvelope, privateKeyPem: string): string {
  if (envelope.alg !== "A256GCM-RSA-OAEP-256") throw new Error("Unsupported algorithm");

  const wrapped = Buffer.from(envelope.wrappedKey, "base64");
  const aesKeyRaw = crypto.privateDecrypt(
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    wrapped
  );

  if (aesKeyRaw.length !== 32) throw new Error("Invalid AES key length");

  const iv = Buffer.from(envelope.iv, "base64");
  const combined = Buffer.from(envelope.ciphertext, "base64");
  if (combined.length < TAG_LENGTH) throw new Error("Invalid ciphertext");

  const tag = combined.subarray(combined.length - TAG_LENGTH);
  const ciphertext = combined.subarray(0, combined.length - TAG_LENGTH);

  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKeyRaw, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}
