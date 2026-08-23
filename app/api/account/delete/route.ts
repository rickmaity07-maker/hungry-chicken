import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// DELETE /api/account/delete — the customer's own "right to erasure" (Art.
// 17 GDPR) button. Deletes the account, sessions, wishlist, and saved
// addresses outright. Orders are NOT deleted — German tax law (§147 AO /
// §257 HGB) requires invoice-relevant records to be kept for 10 years —
// instead we strip the personal identifiers off those specific orders
// (name/phone/address/notes) and leave the accounting-relevant fields
// (items, prices, date, status) intact.
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    await (prisma as any).$transaction([
      (prisma as any).order.updateMany({
        where: { userId },
        data: {
          customerName: "Deleted User",
          customerPhone: null,
          address: null,
          instructions: null,
        },
      }),
      (prisma as any).user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Could not delete account" }, { status: 500 });
  }
}