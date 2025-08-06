import {
  PrismaClient,
  EventCategory,
  EventStatus,
  Gender,
  RoleName,
  TransactionStatus,
  VoucherStatus,
} from "./generated/client";
import { hashPassword } from "../src/utils/hash";
import slugify from "slugify";
import { faker } from "@faker-js/faker";
import { generateReferralCode } from "../src/utils/generateReferralCode";
import { generateTransactionCode } from "../src/utils/transactionCode";
import { generateVoucherCode } from "../src/utils/generateCodeVoucher";

const prisma = new PrismaClient();

async function main() {
  // 🔄 Hapus semua data lama
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

  // 🎭 Roles
  await prisma.role.createMany({
    data: [
      { id: 1, name: RoleName.CUSTOMER },
      { id: 2, name: RoleName.ORGANIZER },
    ],
  });

  const baseDate = new Date();

  // 👤 User utama (fen)
  const fen = await prisma.user.create({
    data: {
      username: "fenkindle",
      email: "fenkindle@gmail.com",
      password: await hashPassword("1234"),
      name: "Fen Kindle",
      referralCode: "FENREF",
      gender: Gender.MALE,
      profileImage: faker.image.avatar(),
      bankName: faker.company.name(),
      bankAccount: faker.finance.accountNumber(),
      accountHolder: faker.person.fullName(),
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

  const allUsers = [fen];

  // 👥 Tambahkan 5 user dengan referral logic
  for (let i = 1; i <= 5; i++) {
    const useReferral = i % 2 === 0; // genap daftar dengan referral
    const referrer = useReferral ? fen : null;

    const referralCode = await generateReferralCode();

    const newUser = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: await hashPassword("1234"),
        name: faker.person.fullName(),
        referralCode,
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        profileImage: faker.image.personPortrait(),
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

    allUsers.push(newUser);

    // Jika pakai referral code
    if (referrer) {
      const referral = await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: newUser.id,
        },
      });

      // Buat coupon untuk user baru
      await prisma.coupon.create({
        data: {
          discount: 10,
          expiresAt: new Date(Date.now() + 90 * 86400000),
          referralId: referral.id,
        },
      });

      // Tambahkan point ke referrer
      await prisma.point.create({
        data: {
          userId: referrer.id,
          amount: 10000,
          expiresAt: new Date(Date.now() + 90 * 86400000),
        },
      });
    }
  }

  // 🎫 Event + Ticket + Voucher + Transaction + Review
  const statuses = Object.values(TransactionStatus);

  for (let i = 1; i <= 15; i++) {
    const organizer = faker.helpers.arrayElement(allUsers);
    const slug = slugify(`${faker.word.words(3)}-${Date.now()}-${i}`, {
      lower: true,
    });

    const event = await prisma.event.create({
      data: {
        name: faker.company.name(),
        slug,
        location: faker.location.city(),
        banner: faker.image.url(),
        description: faker.lorem.paragraphs(2),
        syaratKetentuan: faker.lorem.sentences(3),
        startDate: new Date(baseDate.getTime() + i * 86400000),
        endDate: new Date(baseDate.getTime() + (i + 2) * 86400000),
        organizerId: organizer.id,
        category: faker.helpers.arrayElement(Object.values(EventCategory)),
        eventStatus: faker.helpers.arrayElement(Object.values(EventStatus)),
        vouchers: {
          create: {
            code: await generateVoucherCode(),
            discount: faker.number.int({ min: 5, max: 25 }),
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 86400000),
            status: VoucherStatus.ACTIVE,
          },
        },
        ticketTypes: {
          createMany: {
            data: [
              {
                name: "Reguler",
                price: 75000 + i * 5000,
                quota: 50,
              },
              {
                name: "VIP",
                price: 150000 + i * 7000,
                quota: 20,
              },
            ],
          },
        },
      },
      include: {
        ticketTypes: true,
      },
    });

    // Buat 1–5 transaksi acak
    const buyerCandidates = allUsers.filter((u) => u.id !== organizer.id);
    const numTx = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < numTx; j++) {
      const buyer = faker.helpers.arrayElement(buyerCandidates);
      const status = faker.helpers.arrayElement(statuses);
      const ticketType = faker.helpers.arrayElement(event.ticketTypes);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const totalPrice = ticketType.price * quantity;

      const tx = await prisma.transaction.create({
        data: {
          transactionCode: await generateTransactionCode(),
          customerId: buyer.id,
          eventId: event.id,
          status,
          totalPrice,
          paymentProof: faker.image.urlPicsumPhotos(),
          expiredAt: new Date(Date.now() + 86400000),
          orderItems: {
            create: {
              ticketTypeId: ticketType.id,
              quantity,
              subTotal: totalPrice,
            },
          },
        },
      });

      if (status === "DONE") {
        await prisma.review.create({
          data: {
            rating: faker.number.int({ min: 3, max: 5 }),
            comment: faker.lorem.sentence(),
            eventId: event.id,
            userId: buyer.id,
          },
        });
      }
    }

    console.log(`✅ Event ${event.name} selesai dibuat.`);
  }

  console.log("🔥 Semua data berhasil disiapkan!");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
