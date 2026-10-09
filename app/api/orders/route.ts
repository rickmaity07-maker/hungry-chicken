import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { notifyAdminNewOrder } from "@/lib/notify";

// POST /api/orders — place a cash order. Requires a fully verified login
// (email OTP + phone OTP + clicked confirmation link).
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Please log in to check out." }, { status: 401 });
    }
    if (!(session.user as any).emailVerified) {
      return NextResponse.json({ error: "Please finish verifying your account before checking out." }, { status: 403 });
    }

    const body = await req.json();
    const { items, fulfillment, address, customerName, customerPhone, instructions } = body as {
      items: { id: string; quantity: number; instructions?: string }[];
      fulfillment: "pickup" | "delivery";
      address?: string;
      customerName?: string;
      customerPhone?: string;
      instructions?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (fulfillment === "delivery" && !address) {
      return NextResponse.json({ error: "An address is required for delivery." }, { status: 400 });
    }

    // Re-price everything server-side against the DB menu so nobody can
    // tamper with prices from the client.
    const menuIds = items.map((i) => i.id);
    const menuItems = await (prisma as any).menuItem.findMany({ where: { id: { in: menuIds } } });
    const menuMap = new Map<string, any>(menuItems.map((m: any) => [m.id, m]));

    const orderItemsData = items.map((i) => {
      const menuItem: any = menuMap.get(i.id);
      if (!menuItem) throw new Error(`Item ${i.id} is no longer on the menu.`);
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        brand: menuItem.section,
        quantity: i.quantity,
        price: menuItem.price,
        notes: i.instructions || "",
      };
    });

    // Menu prices are gross (VAT included), so nothing is added on top.
    // `tax` stays 0: the VAT split (7% food / 19% drinks) belongs in the
    // cash register / accounting, not in a surcharge on the customer.
    const subtotal = orderItemsData.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = 0;
    const totalAmount = subtotal;

    const order = await (prisma as any).order.create({
      data: {
        userId: (session.user as any).id,
        fulfillment: fulfillment || "pickup",
        subtotal,
        tax,
        totalAmount,
        instructions: instructions || "",
        customerName: customerName || session.user.name || "",
        customerPhone: customerPhone || (session.user as any).phone || "",
        address: fulfillment === "delivery" ? address : "",
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    await notifyAdminNewOrder(order);

    return NextResponse.json({ ok: true, order });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Could not place order" }, { status: 500 });
  }
}

// GET /api/orders — the logged-in customer's own order history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json([], { status: 200 });

    const orders = await (prisma as any).order.findMany({
      where: { userId: (session.user as any).id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load orders" }, { status: 500 });
  }
}
