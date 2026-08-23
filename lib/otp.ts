// Small helpers around one-time-passcodes used during signup
// (email OTP + phone OTP) and around the follow-up email
// verification link.

export function generateOtp(): string {
  // 6-digit numeric code, e.g. "042913"
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function otpExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function isOtpValid(code: string | null | undefined, expected: string | null | undefined, expires: Date | null | undefined): boolean {
  if (!code || !expected || !expires) return false;
  if (code !== expected) return false;
  if (new Date() > new Date(expires)) return false;
  return true;
}

export function generateVerificationToken(): string {
  // 32 random hex chars, used as the one-click email verification link token
  const bytes = new Uint8Array(24);
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
