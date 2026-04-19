import { compactDecrypt, importPKCS8 } from "jose";

/** Decrypt compact JWE (RSA-OAEP-256 + A256GCM). Private key must be PKCS#8 PEM. */
export async function decryptApplicationJwe(compactJwe: string, privateKeyPem: string): Promise<string> {
  const pem = privateKeyPem.replace(/\\n/g, "\n");
  const privateKey = await importPKCS8(pem, "RSA-OAEP-256");
  const { plaintext } = await compactDecrypt(compactJwe, privateKey);
  return new TextDecoder().decode(plaintext);
}
