import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([], { status: 200 });

  const items = await (prisma as any).wishlistItem.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  try {
    const { menuItemId, name, price, image, brand } = await req.json();
    const item = await (prisma as any).wishlistItem.upsert({
      where: { userId_menuItemId: { userId: (session.user as any).id, menuItemId } },
      update: {},
      create: { userId: (session.user as any).id, menuItemId, name, price, image, brand },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not save to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  try {
    const { menuItemId } = await req.json();
    await (prisma as any).wishlistItem.delete({
      where: { userId_menuItemId: { userId: (session.user as any).id, menuItemId } },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not remove item" }, { status: 500 });
  }
}
