import slugify from "slugify";
import {
  PrismaClient,
  EventCategory,
  EventStatus,
  Gender,
  RoleName,
} from "./generated/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
  await prisma.point.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Roles
  await prisma.role.createMany({
    data: [
      { id: 1, name: RoleName.CUSTOMER },
      { id: 2, name: RoleName.ORGANIZER },
    ],
  });

  const baseDate = new Date();

  // Buat user fenkindle
  const fen = await prisma.user.create({
    data: {
      username: "fenkindle",
      email: "fenkindle@gmail.com",
      password: await hashPassword("1234"),
      name: "Fen Kindle",
      referralCode: "FENREF",
      gender: Gender.MALE,
      roles: {
        createMany: {
          data: [
            { roleId: 1, isActive: true },
            { roleId: 2, isActive: false },
          ],
        },
      },
    },
  });

  // Buat 3 user organizer lain + event
  for (let i = 1; i <= 3; i++) {
    const organizer = await prisma.user.create({
      data: {
        username: `organizer${i}`,
        email: `organizer${i}@example.com`,
        password: await hashPassword("1234"),
        name: `Organizer ${i}`,
        referralCode: `ORG${i}`,
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        roles: {
          createMany: {
            data: [
              { roleId: 1, isActive: false },
              { roleId: 2, isActive: true },
            ],
          },
        },
      },
    });

    const event = await prisma.event.create({
      data: {
        name: `Event Organizer ${i}`,
        slug: slugify(`Event Organizer ${i}-${Date.now()}`, { lower: true }),
        location: `Lokasi ${i}`,
        startDate: new Date(baseDate.getTime() + i * 86400000),
        endDate: new Date(baseDate.getTime() + (i + 2) * 86400000),
        organizerId: organizer.id,
        category:
          Object.values(EventCategory)[i % Object.values(EventCategory).length],
        eventStatus:
          Object.values(EventStatus)[i % Object.values(EventStatus).length],
        vouchers: {
          create: {
            code: `VOUCHERORG${i}`,
            discount: 10,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 86400000),
          },
        },
        ticketTypes: {
          createMany: {
            data: [
              {
                name: `Tiket Reguler Org${i}`,
                price: 75000 + i * 10000,
                quota: 50,
              },
              {
                name: `Tiket VIP Org${i}`,
                price: 125000 + i * 15000,
                quota: 20,
              },
            ],
          },
        },
      },
    });

    console.log(`🎫 Event ${event.name} berhasil dibuat`);
  }

  console.log("✅ Selesai seed user fenkindle + 3 event organizer");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
