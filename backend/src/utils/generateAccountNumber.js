import crypto from "node:crypto";

export function generateAccountNumber() {
  // The database unique index remains the final uniqueness safeguard.
  return crypto.randomInt(100000000000, 999999999999).toString();
}

export function generateReference() {
  return `TXN-${crypto.randomUUID()}`;
}