import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter }) as any;

async function main() {
  // ---------------------------------------------------------------
  // 1. Owner / admin account
  //    Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE in .env first.
  //    This is the ONLY account that can see /admin (the Kitchen Portal).
  // ---------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPhone = process.env.ADMIN_PHONE || "";

  if (adminEmail && adminPassword) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "admin", password: hashed, emailVerified: new Date(), pendingActivation: false },
      create: {
        email: adminEmail,
        phone: adminPhone,
        name: "Owner",
        password: hashed,
        role: "admin",
        emailVerified: new Date(),
        phoneVerified: new Date(),
        otpVerifiedAt: new Date(),
        pendingActivation: false,
      },
    });
    console.log(`✅ Admin account ready: ${adminEmail}`);
  } else {
    console.log("⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin creation.");
    console.log("   You can also just sign up normally, verify the account, then run:");
    console.log('   UPDATE "User" SET role=\'admin\' WHERE email=\'you@example.com\';');
  }

  // ---------------------------------------------------------------
  // 2. Starter menu (safe to run multiple times — skips if already seeded)
  // ---------------------------------------------------------------
  const existingCount = await prisma.menuItem.count();
  if (existingCount > 0) {
    console.log(`ℹ️  Menu already has ${existingCount} items — skipping menu seed.`);
    return;
  }

  const grillItems = [
    { category: "Chicken Classics", name: "Fried Chicken", description: "Hähnchenfleisch, Mehl, Vanille, Ingwer, Weißer Pfeffer", price: 12.0, image: "/grill-1.jpg" },
    { category: "Chicken Classics", name: "Crispy", description: "Hähnchenbrustfleisch, Mehl, Ei, Weißer Pfeffer, Ingwer", price: 10.0, image: "/grill-1.jpg" },
    { category: "Chicken Classics", name: "Schnitzel", description: "Hähnchenbrustfleisch, Mehl, Ei, Weißer Pfeffer", price: 10.0, image: "/grill-3.jpg" },
    { category: "Chicken Classics", name: "Chicken Wings", description: "Hähnchenfleisch, Mehl, Vanille, Ingwer", price: 8.0, image: "/grill-3.jpg" },
    { category: "Grill & Wraps", name: "Schawarma", description: "Hähnchenfleisch, Ingwer, Weißer Pfeffer, Zitronensaft", price: 9.0, image: "/grill-1.jpg" },
    { category: "Grill & Wraps", name: "Shish Taouk", description: "Hähnchenbrustfleisch, Weißer Pfeffer, Ingwer", price: 9.0, image: "/grill-3.jpg" },
    { category: "Grill & Wraps", name: "Mexican", description: "Hähnchenfleisch, Weißer Pfeffer, Mais, Soja, Pilz, Scharf", price: 11.0, image: "/grill-1.jpg" },
    { category: "Grill & Wraps", name: "Fajita", description: "Hähnchenfleisch, Ei, Weißer Pfeffer, Käse, Paprika", price: 11.0, image: "/grill-3.jpg" },
    { category: "Seafood & Sides", name: "Hammour Fisch", description: "Hammour Fisch, Mehl, Ei, Weißer Pfeffer, Ingwer", price: 15.0, image: "/grill-1.jpg" },
    { category: "Seafood & Sides", name: "Falafel", description: "Kichererbsen, Petersilie, Koriander, Salz", price: 7.0, image: "/grill-3.jpg" },
    { category: "Seafood & Sides", name: "Pommes", description: "Classic French Fries", price: 5.0, image: "/grill-3.jpg" },
  ].map((i, idx) => ({ ...i, section: "grill", sortOrder: idx }));

  const sweetsItems = [
    { category: "Imbiratur", name: "Extra Groß", description: "Signature giant fruit and juice glass", price: 15.0, image: "/sweets-2.jpg" },
    { category: "Imbiratur", name: "Mittel", description: "Medium signature fruit glass", price: 12.0, image: "/sweets-2.jpg" },
    { category: "Imbiratur", name: "To Go", description: "Takeaway signature fruit cup", price: 10.0, image: "/sweets-3.jpg" },
    { category: "Frische Säfte", name: "Erdbeere", description: "Fresh Strawberry", price: 7.0, image: "/sweets-2.jpg" },
    { category: "Frische Säfte", name: "Orange", description: "Freshly squeezed Orange", price: 6.5, image: "/sweets-3.jpg" },
    { category: "Frische Säfte", name: "Mango", description: "Fresh Mango puree", price: 7.0, image: "/sweets-2.jpg" },
    { category: "Frische Säfte", name: "Zitrone & Minze", description: "Lemon & Mint", price: 8.0, image: "/sweets-3.jpg" },
    { category: "Frische Säfte", name: "Ananas", description: "Fresh Pineapple", price: 7.0, image: "/sweets-2.jpg" },
  ].map((i, idx) => ({ ...i, section: "sweets", sortOrder: idx }));

  await prisma.menuItem.createMany({ data: [...grillItems, ...sweetsItems] });
  console.log(`✅ Seeded ${grillItems.length + sweetsItems.length} menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
