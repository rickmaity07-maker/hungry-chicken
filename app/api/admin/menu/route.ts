import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await (prisma as any).menuItem.findMany({ orderBy: [{ section: "asc" }, { category: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const item = await (prisma as any).menuItem.create({
      data: {
        section: data.section,
        category: data.category,
        name: data.name,
        description: data.description || "",
        price: parseFloat(data.price),
        image: data.image || "",
        available: data.available ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not create item" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...rest } = await req.json();
    if (rest.price !== undefined) rest.price = parseFloat(rest.price);
    const item = await (prisma as any).menuItem.update({ where: { id }, data: rest });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await (prisma as any).menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not delete item" }, { status: 500 });
  }
}
