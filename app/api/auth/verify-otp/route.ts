import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOtpValid, generateVerificationToken, otpExpiryDate } from "@/lib/otp";
import { sendVerificationLinkEmail } from "@/lib/notify";

// Step 2 of signup: confirm the 6-digit codes sent to email + phone.
// Once BOTH are correct we email a one-click confirmation link
// (this is the "email verification link" step requested on top of OTP).
export async function POST(req: Request) {
  try {
    const { email, emailCode, phoneCode } = await req.json();
    if (!email || !emailCode || !phoneCode) {
      return NextResponse.json({ error: "Missing codes." }, { status: 400 });
    }

    const user = await (prisma as any).user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "No pending signup for this email." }, { status: 404 });

    const emailOk = isOtpValid(emailCode, user.emailOtpCode, user.emailOtpExpires);
    const phoneOk = isOtpValid(phoneCode, user.phoneOtpCode, user.phoneOtpExpires);

    if (!emailOk || !phoneOk) {
      return NextResponse.json(
        { error: !emailOk && !phoneOk ? "Both codes are incorrect or expired." : !emailOk ? "Email code is incorrect or expired." : "Phone code is incorrect or expired." },
        { status: 400 }
      );
    }

    const token = generateVerificationToken();
    await (prisma as any).verificationToken.create({
      data: { identifier: email, token, expires: otpExpiryDate(60 * 24) }, // 24h link
    });

    await (prisma as any).user.update({
      where: { email },
      data: {
        otpVerifiedAt: new Date(),
        phoneVerified: new Date(),
        emailOtpCode: null,
        phoneOtpCode: null,
      },
    });

    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verifyUrl = `${base}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    await sendVerificationLinkEmail(email, verifyUrl);

    return NextResponse.json({ ok: true, message: "Codes verified. Check your email for the final confirmation link." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
