import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, otpExpiryDate } from "@/lib/otp";
import { sendEmailOtp, sendPhoneOtp } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await (prisma as any).user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "No pending signup for this email." }, { status: 404 });

    const emailCode = generateOtp();
    const phoneCode = generateOtp();
    const expires = otpExpiryDate(10);

    await (prisma as any).user.update({
      where: { email },
      data: { emailOtpCode: emailCode, emailOtpExpires: expires, phoneOtpCode: phoneCode, phoneOtpExpires: expires },
    });

    await Promise.all([sendEmailOtp(email, emailCode), sendPhoneOtp(user.phone, phoneCode)]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not resend codes" }, { status: 500 });
  }
}
