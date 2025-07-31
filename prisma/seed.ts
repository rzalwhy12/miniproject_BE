import { faker } from "@faker-js/faker";
import {
  EventCategory,
  EventStatus,
  Gender,
  PrismaClient,
  RoleName,
  TransactionStatus,
  VoucherStatus,
} from "./generated/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
  await prisma.coupon.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.point.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Seed Role with fixed ID
  const customerRole = await prisma.role.create({
    data: { id: 1, name: RoleName.CUSTOMER },
  });
  const organizerRole = await prisma.role.create({
    data: { id: 2, name: RoleName.ORGANIZER },
  });

  const users: any[] = [];

  for (let i = 1; i <= 20; i++) {
    const gender = faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]);
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await hashPassword("password"),
        name: faker.person.fullName(),
        noTlp: faker.phone.number(),
        birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 45 }),
        gender,
        referralCode: `REF${i.toString().padStart(4, "0")}`,
        isVerified: true,
        profileImage: faker.image.avatar(),
      },
    });

    users.push(user);

    await prisma.userRole.createMany({
      data: [
        { userId: user.id, roleId: customerRole.id, isActive: true },
        { userId: user.id, roleId: organizerRole.id, isActive: false },
      ],
    });

    const startDate = faker.date.soon({ days: 30 });
    const endDate = faker.date.soon({ days: 3, refDate: startDate });

    const event = await prisma.event.create({
      data: {
        name: faker.company.name(),
        banner: faker.image.url(),
        description: faker.lorem.paragraph(),
        syaratKetentuan: faker.lorem.sentence(),
        startDate,
        endDate,
        location: faker.location.city(),
        organizerId: user.id,
        category: faker.helpers.arrayElement(Object.values(EventCategory)),
        eventStatus: faker.helpers.arrayElement(Object.values(EventStatus)),
      },
    });

    const ticket1 = await prisma.ticketType.create({
      data: {
        name: "Reguler",
        price: 50000,
        quota: 100,
        descriptionTicket: "Tiket reguler",
        benefit: "Akses umum",
        eventId: event.id,
      },
    });

    const ticket2 = await prisma.ticketType.create({
      data: {
        name: "VIP",
        price: 100000,
        quota: 50,
        descriptionTicket: "Tiket VIP",
        benefit: "Akses VIP + makanan",
        eventId: event.id,
      },
    });

    await prisma.voucher.create({
      data: {
        code: `VOUCH${i.toString().padStart(3, "0")}`,
        discount: 10,
        status: VoucherStatus.ACTIVE,
        startDate,
        endDate,
        eventId: event.id,
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        customerId: user.id,
        eventId: event.id,
        status: TransactionStatus.DONE,
        paymentProof: faker.image.url(),
        expiredAt: faker.date.future(),
        orderItems: {
          create: [
            {
              ticketTypeId: ticket1.id,
              quantity: 1,
              subTotal: ticket1.price,
            },
          ],
        },
      },
    });

    await prisma.review.create({
      data: {
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentence(),
        eventId: event.id,
        userId: user.id,
      },
    });

    await prisma.point.create({
      data: {
        userId: user.id,
        amount: faker.number.int({ min: 5000, max: 20000 }),
        expiresAt: faker.date.future(),
      },
    });
  }

  // Referral System
  for (let i = 0; i < 10; i++) {
    const referrer = users[i];
    const referred = users[19 - i];

    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: referred.id,
      },
    });

    await prisma.coupon.create({
      data: {
        discount: 10,
        expiresAt: faker.date.future(),
        referralId: referral.id,
      },
    });

    await prisma.point.create({
      data: {
        userId: referrer.id,
        amount: 10000,
        expiresAt: faker.date.future(),
      },
    });
  }

  console.log("✅ Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
