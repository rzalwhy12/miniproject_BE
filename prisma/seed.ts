// seed.ts
import {
  PrismaClient,
  EventStatus,
  EventCategory,
  Gender,
  RoleName,
  TransactionStatus,
  VoucherStatus,
} from "./generated/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";
import { hashPassword } from "../src/utils/hash";
import { generateReferralCode } from "../src/utils/generateReferralCode";
import { generateTransactionCode } from "../src/utils/transactionCode";
import { generateVoucherCode } from "../src/utils/generateCodeVoucher";

const prisma = new PrismaClient();

async function main() {
  // Clear
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

  // Main user
  const refUser = await prisma.user.create({
    data: {
      username: "fenkindle",
      email: "fenkindle@gmail.com",
      password: await hashPassword("1234"),
      name: "Fen Kindle",
      gender: Gender.MALE,
      referralCode: "FENREF",
      profileImage: faker.image.avatar(),
      bankAccount: faker.finance.accountNumber(),
      bankName: faker.company.name(),
      accountHolder: faker.person.fullName(),
      roles: {
        createMany: {
          data: [
            { roleId: 1, isActive: true },
            { roleId: 2, isActive: true },
          ],
        },
      },
    },
  });

  const allUsers = [refUser];

  for (let i = 0; i < 14; i++) {
    const referred = i % 2 === 0;
    const referralCode = await generateReferralCode();

    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@mail.com`,
        password: await hashPassword("1234"),
        name: faker.person.fullName(),
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        referralCode,
        profileImage: faker.image.avatar(),
        bankAccount: faker.finance.accountNumber(),
        bankName: faker.company.name(),
        accountHolder: faker.person.fullName(),
        roles: {
          createMany: {
            data: [
              { roleId: 1, isActive: true },
              { roleId: 2, isActive: true },
            ],
          },
        },
      },
    });

    allUsers.push(user);

    if (referred) {
      const referral = await prisma.referral.create({
        data: {
          referredId: user.id,
          referrerId: refUser.id,
        },
      });

      await prisma.coupon.create({
        data: {
          discount: 10,
          expiresAt: new Date(Date.now() + 90 * 86400000),
          referralId: referral.id,
        },
      });

      await prisma.point.create({
        data: {
          userId: refUser.id,
          amount: 10000,
          expiresAt: new Date(Date.now() + 90 * 86400000),
        },
      });
    }
  }

  const eventList = [];
  const txStatuses = [
    "WAITING_CONFIRMATION",
    "WAITING_PAYMENT",
    "DONE",
    "REJECT",
  ];

  for (let i = 0; i < 20; i++) {
    const isDraft = i < 5;
    const isPast = i >= 5 && i < 10;
    const isPublished = i >= 10;

    const organizer = faker.helpers.arrayElement(allUsers);
    const slug = slugify(`${faker.word.words(2)}-${i}`, { lower: true });

    const event = await prisma.event.create({
      data: {
        name: `Festival ${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
        slug,
        location: faker.location.city(),
        description: `<p>${faker.lorem.paragraph()}</p><ul><li>${faker.lorem.sentence()}</li><li>${faker.lorem.sentence()}</li></ul>`,
        syaratKetentuan: `
          <ul>
            <li>Tiket tidak dapat dikembalikan</li>
            <li>Harap membawa bukti transaksi saat masuk</li>
            <li>Gunakan referral untuk dapatkan <strong>kupon diskon 10%</strong></li>
          </ul>
        `,
        banner: faker.image.url(),
        startDate: new Date(baseDate.getTime() + i * 86400000),
        endDate: new Date(baseDate.getTime() + (i + 1) * 86400000),
        organizerId: organizer.id,
        category: faker.helpers.arrayElement(Object.values(EventCategory)),
        eventStatus: isDraft
          ? EventStatus.DRAFT
          : isPast
          ? EventStatus.PAST
          : EventStatus.PUBLISHED,
        ticketTypes: {
          createMany: {
            data: [
              {
                name: "Reguler",
                price: 50000 + i * 1000,
                quota: 100,
              },
              {
                name: "VIP",
                price: 100000 + i * 1500,
                quota: 50,
              },
            ],
          },
        },
        vouchers: {
          create: {
            code: await generateVoucherCode(),
            discount: 10,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 86400000),
            status: VoucherStatus.ACTIVE,
          },
        },
      },
      include: { ticketTypes: true },
    });

    eventList.push(event);
  }

  let txCount = 0;
  while (txCount < 60) {
    const event = faker.helpers.arrayElement(
      eventList.filter((e) => e.eventStatus !== EventStatus.DRAFT)
    );
    const ticket = faker.helpers.arrayElement(event.ticketTypes);
    const buyer = faker.helpers.arrayElement(allUsers);
    const quantity = faker.number.int({ min: 1, max: 3 });
    const total = ticket.price * quantity;
    const status = faker.helpers.arrayElement(txStatuses);

    const tx = await prisma.transaction.create({
      data: {
        transactionCode: await generateTransactionCode(),
        customerId: buyer.id,
        eventId: event.id,
        totalPrice: total,
        status: TransactionStatus.WAITING_CONFIRMATION,
        expiredAt: new Date(Date.now() + 86400000),
        paymentProof: faker.image.urlPicsumPhotos(),
        orderItems: {
          create: {
            ticketTypeId: ticket.id,
            quantity,
            subTotal: total,
          },
        },
      },
    });

    if (status === "DONE") {
      await prisma.review.create({
        data: {
          userId: buyer.id,
          eventId: event.id,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentence(),
        },
      });
    }

    txCount++;
  }

  // Tambahan: 3 event dengan transaksi tinggi untuk testing reporting
  for (let j = 0; j < 3; j++) {
    const slug = slugify(`high-traffic-event-${j}`, { lower: true });
    const organizer = faker.helpers.arrayElement(allUsers);

    const event = await prisma.event.create({
      data: {
        name: `Big Festival ${faker.commerce.productName()}`,
        slug,
        location: faker.location.city(),
        description: `<p>${faker.lorem.paragraph()}</p>`,
        syaratKetentuan: `<ul><li>Tidak bisa refund</li></ul>`,
        banner: faker.image.url(),
        startDate: new Date(Date.now() - 10 * 86400000),
        endDate: new Date(Date.now() - 9 * 86400000),
        organizerId: organizer.id,
        category: EventCategory.MUSIC,
        eventStatus: EventStatus.PAST,
        ticketTypes: {
          createMany: {
            data: [
              { name: "Reguler", price: 50000, quota: 200 },
              { name: "VIP", price: 100000, quota: 100 },
            ],
          },
        },
      },
      include: { ticketTypes: true },
    });

    for (let t = 0; t < 30; t++) {
      const buyer = faker.helpers.arrayElement(allUsers);
      const ticket = faker.helpers.arrayElement(event.ticketTypes);
      const quantity = faker.number.int({ min: 1, max: 5 });
      const total = ticket.price * quantity;

      await prisma.transaction.create({
        data: {
          transactionCode: await generateTransactionCode(),
          customerId: buyer.id,
          eventId: event.id,
          totalPrice: total,
          status: TransactionStatus.DONE,
          expiredAt: new Date(Date.now() - 8 * 86400000),
          paymentProof: faker.image.urlPicsumPhotos(),
          orderItems: {
            create: {
              ticketTypeId: ticket.id,
              quantity,
              subTotal: total,
            },
          },
        },
      });

      await prisma.review.create({
        data: {
          userId: buyer.id,
          eventId: event.id,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentence(),
        },
      });
    }
  }

  // Tambahan khusus Fen Kindle: transaksi bervariasi untuk first 6 event
  for (let i = 0; i < 6; i++) {
    const event = eventList[i];
    const ticket = event.ticketTypes[0];
    const quantity = i + 1;
    const total = ticket.price * quantity;
    const statusesFen = [
      TransactionStatus.DONE,
      TransactionStatus.REJECTED,
      TransactionStatus.WAITING_PAYMENT,
      TransactionStatus.WAITING_CONFIRMATION,
    ];
    const statusFen = statusesFen[i % statusesFen.length];

    await prisma.transaction.create({
      data: {
        transactionCode: await generateTransactionCode(),
        customerId: refUser.id,
        eventId: event.id,
        totalPrice: total,
        status: statusFen,
        expiredAt: new Date(Date.now() + 86400000),
        paymentProof: faker.image.urlPicsumPhotos(),
        orderItems: {
          create: {
            ticketTypeId: ticket.id,
            quantity,
            subTotal: total,
          },
        },
      },
    });

    if (statusFen === TransactionStatus.DONE) {
      await prisma.review.create({
        data: {
          userId: refUser.id,
          eventId: event.id,
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: `Review Fen Kindle: ${faker.lorem.sentence()}`,
        },
      });
    }
  }

  console.log(
    "✅ Seed selesai: 20 event biasa, 3 high-traffic event, 15 user, 60+ transaksi, + transaksi khusus Fen Kindle"
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
