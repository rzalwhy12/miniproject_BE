import slugify from "slugify";
import {
  EventCategory,
  EventStatus,
  Gender,
  PrismaClient,
  RoleName,
  TransactionStatus,
} from "./generated/client";
import { hashPassword } from "../src/utils/hash";
import { generateTransactionCode } from "../src/utils/transactionCode";

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

  await prisma.role.createMany({
    data: [
      { id: 1, name: RoleName.CUSTOMER },
      { id: 2, name: RoleName.ORGANIZER },
    ],
  });

  const baseDate = new Date();

  // 🔹 Buat 1 user referrer utama
  const referrerUser = await prisma.user.create({
    data: {
      username: "referrer1",
      email: "referrer1@example.com",
      password: await hashPassword("1234"),
      name: "Referrer User",
      referralCode: "REFMAIN",
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

  for (let i = 1; i <= 10; i++) {
    const gender = i % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    const referred = i % 3 === 0; // user 3, 6, 9 akan pakai referral

    const referralCode = `REFCODE${i}`;

    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: await hashPassword("1234"),
        name: `User ${i}`,
        referralCode,
        gender,
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

    // 🔹 Jika user ini didaftarkan dengan referral:
    if (referred) {
      // Buat referral & kupon
      await prisma.referral.create({
        data: {
          referrerId: referrerUser.id,
          referredId: user.id,
          coupon: {
            create: {
              discount: 10,
              expiresAt: new Date(baseDate.getTime() + 90 * 86400000),
            },
          },
        },
      });

      // Tambahkan poin ke referrer
      await prisma.point.create({
        data: {
          userId: referrerUser.id,
          amount: 10000,
          expiresAt: new Date(baseDate.getTime() + 90 * 86400000),
        },
      });
    }

    // Event & tiket oleh user ini (biar semua user juga jadi organizer)
    const event = await prisma.event.create({
      data: {
        name: `Event ${i}`,
        slug: slugify(`Event ${i}-${Date.now()}`, { lower: true }),
        location: `Lokasi ${i}`,
        startDate: new Date(baseDate.getTime() + i * 86400000),
        endDate: new Date(baseDate.getTime() + (i + 1) * 86400000),
        organizerId: user.id,
        category:
          Object.values(EventCategory)[i % Object.values(EventCategory).length],
        eventStatus:
          Object.values(EventStatus)[i % Object.values(EventStatus).length],
        vouchers: {
          create: {
            code: `EVENTVOUCHER${i}`,
            discount: 15,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 86400000),
          },
        },
      },
    });
    const ticket = await prisma.ticketType.create({
      data: {
        name: `Ticket ${i}`,
        price: 50000 + i * 10000,
        quota: 100,
        eventId: event.id,
      },
    });

    // Optional: buat transaksi untuk user yang pakai referral
    if (referred) {
      await prisma.transaction.create({
        data: {
          customerId: user.id,
          eventId: event.id,
          transactionCode: await generateTransactionCode(),
          status: TransactionStatus.WAITING_PAYMENT,
          totalPrice: ticket.price * 2,
          expiredAt: new Date(baseDate.getTime() + 2 * 86400000),
          orderItems: {
            create: {
              ticketTypeId: ticket.id,
              quantity: 2,
              subTotal: ticket.price * 2,
            },
          },
        },
      });
    }
  }

  console.log("✅ Seeding selesai: user, event, referral, poin, dan kupon");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
