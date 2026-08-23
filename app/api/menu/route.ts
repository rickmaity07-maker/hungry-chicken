import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu?section=grill|sweets — public menu for the storefront
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    const items = await (prisma as any).menuItem.findMany({
      where: { available: true, ...(section ? { section } : {}) },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load menu" }, { status: 500 });
  }
}
