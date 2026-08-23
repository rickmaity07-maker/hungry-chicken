import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateOtp, otpExpiryDate } from "@/lib/otp";
import { sendEmailOtp, sendPhoneOtp } from "@/lib/notify";

// Step 1 of signup: collect name + email + phone + password,
// create a (pendingActivation) user, and fire off an OTP to
// both the email address and the phone number.
export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!email || !phone || !password) {
      return NextResponse.json({ error: "Email, phone and password are all required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existing = await (prisma as any).user.findUnique({ where: { email } });
    if (existing && existing.otpVerifiedAt && !existing.pendingActivation) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in instead." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const emailCode = generateOtp();
    const phoneCode = generateOtp();
    const expires = otpExpiryDate(10);

    const user = await (prisma as any).user.upsert({
      where: { email },
      update: {
        name,
        phone,
        password: hashed,
        emailOtpCode: emailCode,
        emailOtpExpires: expires,
        phoneOtpCode: phoneCode,
        phoneOtpExpires: expires,
        otpVerifiedAt: null,
        pendingActivation: true,
        emailVerified: null,
        phoneVerified: null,
      },
      create: {
        name,
        email,
        phone,
        password: hashed,
        role: "user",
        emailOtpCode: emailCode,
        emailOtpExpires: expires,
        phoneOtpCode: phoneCode,
        phoneOtpExpires: expires,
        pendingActivation: true,
      },
    });

    await Promise.all([sendEmailOtp(email, emailCode), sendPhoneOtp(phone, phoneCode)]);

    return NextResponse.json({ ok: true, userId: user.id, email, phone });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
