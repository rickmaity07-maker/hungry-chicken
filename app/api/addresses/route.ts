import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([], { status: 200 });

  const addresses = await (prisma as any).address.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { isDefault: "desc" },
  });
  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  try {
    const data = await req.json();
    const address = await (prisma as any).address.create({
      data: { ...data, userId: (session.user as any).id },
    });
    return NextResponse.json(address);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not save address" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  try {
    const { id } = await req.json();
    await (prisma as any).address.deleteMany({ where: { id, userId: (session.user as any).id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not remove address" }, { status: 500 });
  }
}
