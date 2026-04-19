export interface EncryptedEnvelope {
  alg: "A256GCM-RSA-OAEP-256";
  wrappedKey: string;
  iv: string;
  ciphertext: string;
}
