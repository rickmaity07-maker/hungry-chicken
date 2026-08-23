import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/account/export — Art. 20 GDPR data portability: a full JSON
// dump of everything this app stores about the logged-in customer.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        // Deliberately excluded: password hash, OTP codes — not meaningful
        // to export and shouldn't leave the server even hashed.
      },
    });
    const orders = await (prisma as any).order.findMany({ where: { userId }, include: { items: true } });
    const wishlist = await (prisma as any).wishlistItem.findMany({ where: { userId } });
    const addresses = await (prisma as any).address.findMany({ where: { userId } });

    const exportData = {
      exportedAt: new Date().toISOString(),
      account: user,
      orders,
      wishlist,
      addresses,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="my-hungry-chicken-data.json"`,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Could not export data" }, { status: 500 });
  }
}