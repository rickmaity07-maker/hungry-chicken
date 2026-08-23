import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Step 3 of signup: the customer clicks the link we emailed them.
// This is what finally flips `pendingActivation` off and sets
// `emailVerified`, which is what checkout requires.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!token || !email) {
    return NextResponse.redirect(`${base}/?verify=missing`);
  }

  try {
    const record = await (prisma as any).verificationToken.findUnique({ where: { token } });
    if (!record || record.identifier !== email || new Date() > new Date(record.expires)) {
      return NextResponse.redirect(`${base}/?verify=expired`);
    }

    await (prisma as any).user.update({
      where: { email },
      data: { emailVerified: new Date(), pendingActivation: false },
    });

    await (prisma as any).verificationToken.delete({ where: { token } }).catch(() => {});

    return NextResponse.redirect(`${base}/?verify=success`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${base}/?verify=error`);
  }
}
