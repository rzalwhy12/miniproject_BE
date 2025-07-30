// prisma/seed.ts
import {
  EventCategory,
  EventStatus,
  Gender,
  TransactionStatus,
  VoucherStatus,
  RoleName, // pastikan enum RoleName ada
} from "./generated/client";
import { hashPassword } from "../src/utils/hash";
import { prisma } from "../src/config/prisma";

async function main() {
  const passwordHash = await hashPassword("password!23");

  // 1. Upsert Role enum ke table Role
  const [customerRole, organizerRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: RoleName.CUSTOMER },
      update: {},
      create: { name: RoleName.CUSTOMER },
    }),
    prisma.role.upsert({
      where: { name: RoleName.ORGANIZER },
      update: {},
      create: { name: RoleName.ORGANIZER },
    }),
  ]);

  // 2. Buat user tanpa field 'role'
  const user1 = await prisma.user.create({
    data: {
      username: "johndoe",
      email: "john@example.com",
      password: passwordHash,
      name: "John Doe",
      noTlp: "081234567890",
      birthDate: new Date("1995-05-10"),
      gender: Gender.MALE,
      referralCode: "REF12345",
      isVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "janesmith",
      email: "jane@example.com",
      password: passwordHash,
      name: "Jane Smith",
      birthDate: new Date("1998-09-25"),
      gender: Gender.FEMALE,
      referralCode: "REF67890",
      isVerified: false,
    },
  });

  // 3. Assign Role ke User lewat tabel pivot UserRole
  await prisma.userRole.createMany({
    data: [
      {
        userId: user1.id,
        roleId: customerRole.id,
        isActive: true, // user1 aktif sebagai customer
      },
      {
        userId: user2.id,
        roleId: organizerRole.id,
        isActive: true, // user2 aktif sebagai organizer
      },
      {
        userId: user2.id,
        roleId: customerRole.id,
        isActive: false, // user2 juga bisa jadi customer (multi-role)
      },
    ],
  });

  // 4. Event dan data lainnya
  const event = await prisma.event.create({
    data: {
      name: "React Conference 2025",
      description: "Konferensi React terbesar di Asia Tenggara.",
      syaratKetentuan: "Bawa laptop dan semangat belajar.",
      category: EventCategory.CONFERENCE,
      startDate: new Date("2025-08-15"),
      endDate: new Date("2025-08-17"),
      location: "Jakarta Convention Center",
      statusEvent: EventStatus.PUBLISHED,
      organizerId: user2.id,
    },
  });

  const ticket = await prisma.ticketType.create({
    data: {
      name: "General Admission",
      price: 250000,
      quota: 100,
      description: "Tiket masuk umum.",
      benefit: "Snack & Sertifikat",
      eventId: event.id,
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      customerId: user1.id,
      eventId: event.id,
      status: TransactionStatus.WAITING_PAYMENT,
      totalPrice: 500000,
    },
  });

  await prisma.orderItem.create({
    data: {
      transactionId: transaction.id,
      ticketTypeId: ticket.id,
      quantity: 2,
      subTotal: 500000,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Event sangat bermanfaat!",
      eventId: event.id,
      userId: user1.id,
    },
  });

  const tag = await prisma.tag.create({
    data: {
      name: "Tech",
    },
  });

  await prisma.eventTag.create({
    data: {
      eventId: event.id,
      tagId: tag.id,
    },
  });

  await prisma.voucher.create({
    data: {
      code: "DISC50",
      discount: 50,
      status: VoucherStatus.ACTIVE,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-08-30"),
      eventId: event.id,
    },
  });

  const referral = await prisma.referral.create({
    data: {
      referrerId: user1.id,
      referredId: user2.id,
    },
  });

  await prisma.coupon.create({
    data: {
      discount: 10,
      expiresAt: new Date("2025-12-31"),
      referralId: referral.id,
    },
  });

  await prisma.point.create({
    data: {
      userId: user1.id,
      amount: 50,
      expiresAt: new Date("2025-10-31"),
    },
  });

  console.log("🌱 Dummy data berhasil di-seed dengan role!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
