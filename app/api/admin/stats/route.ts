import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [pendingCount, preparingCount, todayOrders, totalCustomers] = await Promise.all([
    (prisma as any).order.count({ where: { status: "pending" } }),
    (prisma as any).order.count({ where: { status: "preparing" } }),
    (prisma as any).order.findMany({ where: { createdAt: { gte: startOfToday } } }),
    (prisma as any).user.count({ where: { role: "user" } }),
  ]);

  const todayRevenue = todayOrders
    .filter((o: any) => o.status !== "cancelled")
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

  return NextResponse.json({
    pendingCount,
    preparingCount,
    todayOrderCount: todayOrders.length,
    todayRevenue,
    totalCustomers,
  });
}
