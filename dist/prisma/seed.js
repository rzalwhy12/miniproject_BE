"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// seed.ts
const client_1 = require("./generated/client");
const faker_1 = require("@faker-js/faker");
const slugify_1 = __importDefault(require("slugify"));
const hash_1 = require("../src/utils/hash");
const generateReferralCode_1 = require("../src/utils/generateReferralCode");
const transactionCode_1 = require("../src/utils/transactionCode");
const generateCodeVoucher_1 = require("../src/utils/generateCodeVoucher");
const prisma = new client_1.PrismaClient();
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
            { id: 1, name: client_1.RoleName.CUSTOMER },
            { id: 2, name: client_1.RoleName.ORGANIZER },
        ],
    });
    const baseDate = new Date();
    // Main user
    const refUser = await prisma.user.create({
        data: {
            username: "fenkindle",
            email: "fenkindle@gmail.com",
            password: await (0, hash_1.hashPassword)("1234"),
            name: "Fen Kindle",
            gender: client_1.Gender.MALE,
            referralCode: "FENREF",
            profileImage: faker_1.faker.image.avatar(),
            bankAccount: faker_1.faker.finance.accountNumber(),
            bankName: faker_1.faker.company.name(),
            accountHolder: faker_1.faker.person.fullName(),
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
        const referralCode = await (0, generateReferralCode_1.generateReferralCode)();
        const user = await prisma.user.create({
            data: {
                username: `user${i}`,
                email: `user${i}@mail.com`,
                password: await (0, hash_1.hashPassword)("1234"),
                name: faker_1.faker.person.fullName(),
                gender: i % 2 === 0 ? client_1.Gender.FEMALE : client_1.Gender.MALE,
                referralCode,
                profileImage: faker_1.faker.image.avatar(),
                bankAccount: faker_1.faker.finance.accountNumber(),
                bankName: faker_1.faker.company.name(),
                accountHolder: faker_1.faker.person.fullName(),
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
        const organizer = faker_1.faker.helpers.arrayElement(allUsers);
        const slug = (0, slugify_1.default)(`${faker_1.faker.word.words(2)}-${i}`, { lower: true });
        const event = await prisma.event.create({
            data: {
                name: `Festival ${faker_1.faker.commerce.productAdjective()} ${faker_1.faker.commerce.productName()}`,
                slug,
                location: faker_1.faker.location.city(),
                description: `<p>${faker_1.faker.lorem.paragraph()}</p><ul><li>${faker_1.faker.lorem.sentence()}</li><li>${faker_1.faker.lorem.sentence()}</li></ul>`,
                syaratKetentuan: `
          <ul>
            <li>Tiket tidak dapat dikembalikan</li>
            <li>Harap membawa bukti transaksi saat masuk</li>
            <li>Gunakan referral untuk dapatkan <strong>kupon diskon 10%</strong></li>
          </ul>
        `,
                banner: faker_1.faker.image.url(),
                startDate: new Date(baseDate.getTime() + i * 86400000),
                endDate: new Date(baseDate.getTime() + (i + 1) * 86400000),
                organizerId: organizer.id,
                category: faker_1.faker.helpers.arrayElement(Object.values(client_1.EventCategory)),
                eventStatus: isDraft
                    ? client_1.EventStatus.DRAFT
                    : isPast
                        ? client_1.EventStatus.PAST
                        : client_1.EventStatus.PUBLISHED,
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
                        code: await (0, generateCodeVoucher_1.generateVoucherCode)(),
                        discount: 10,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 86400000),
                        status: client_1.VoucherStatus.ACTIVE,
                    },
                },
            },
            include: { ticketTypes: true },
        });
        eventList.push(event);
    }
    let txCount = 0;
    while (txCount < 60) {
        const event = faker_1.faker.helpers.arrayElement(eventList.filter((e) => e.eventStatus !== client_1.EventStatus.DRAFT));
        const ticket = faker_1.faker.helpers.arrayElement(event.ticketTypes);
        const buyer = faker_1.faker.helpers.arrayElement(allUsers);
        const quantity = faker_1.faker.number.int({ min: 1, max: 3 });
        const total = ticket.price * quantity;
        const status = faker_1.faker.helpers.arrayElement(txStatuses);
        const tx = await prisma.transaction.create({
            data: {
                transactionCode: await (0, transactionCode_1.generateTransactionCode)(),
                customerId: buyer.id,
                eventId: event.id,
                totalPrice: total,
                status: client_1.TransactionStatus.WAITING_CONFIRMATION,
                expiredAt: new Date(Date.now() + 86400000),
                paymentProof: faker_1.faker.image.urlPicsumPhotos(),
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
                    rating: faker_1.faker.number.int({ min: 3, max: 5 }),
                    comment: faker_1.faker.lorem.sentence(),
                },
            });
        }
        txCount++;
    }
    // Tambahan: 3 event dengan transaksi tinggi untuk testing reporting
    for (let j = 0; j < 3; j++) {
        const slug = (0, slugify_1.default)(`high-traffic-event-${j}`, { lower: true });
        const organizer = faker_1.faker.helpers.arrayElement(allUsers);
        const event = await prisma.event.create({
            data: {
                name: `Big Festival ${faker_1.faker.commerce.productName()}`,
                slug,
                location: faker_1.faker.location.city(),
                description: `<p>${faker_1.faker.lorem.paragraph()}</p>`,
                syaratKetentuan: `<ul><li>Tidak bisa refund</li></ul>`,
                banner: faker_1.faker.image.url(),
                startDate: new Date(Date.now() - 10 * 86400000),
                endDate: new Date(Date.now() - 9 * 86400000),
                organizerId: organizer.id,
                category: client_1.EventCategory.MUSIC,
                eventStatus: client_1.EventStatus.PAST,
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
            const buyer = faker_1.faker.helpers.arrayElement(allUsers);
            const ticket = faker_1.faker.helpers.arrayElement(event.ticketTypes);
            const quantity = faker_1.faker.number.int({ min: 1, max: 5 });
            const total = ticket.price * quantity;
            await prisma.transaction.create({
                data: {
                    transactionCode: await (0, transactionCode_1.generateTransactionCode)(),
                    customerId: buyer.id,
                    eventId: event.id,
                    totalPrice: total,
                    status: client_1.TransactionStatus.DONE,
                    expiredAt: new Date(Date.now() - 8 * 86400000),
                    paymentProof: faker_1.faker.image.urlPicsumPhotos(),
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
                    rating: faker_1.faker.number.int({ min: 3, max: 5 }),
                    comment: faker_1.faker.lorem.sentence(),
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
            client_1.TransactionStatus.DONE,
            client_1.TransactionStatus.REJECTED,
            client_1.TransactionStatus.WAITING_PAYMENT,
            client_1.TransactionStatus.WAITING_CONFIRMATION,
        ];
        const statusFen = statusesFen[i % statusesFen.length];
        await prisma.transaction.create({
            data: {
                transactionCode: await (0, transactionCode_1.generateTransactionCode)(),
                customerId: refUser.id,
                eventId: event.id,
                totalPrice: total,
                status: statusFen,
                expiredAt: new Date(Date.now() + 86400000),
                paymentProof: faker_1.faker.image.urlPicsumPhotos(),
                orderItems: {
                    create: {
                        ticketTypeId: ticket.id,
                        quantity,
                        subTotal: total,
                    },
                },
            },
        });
        if (statusFen === client_1.TransactionStatus.DONE) {
            await prisma.review.create({
                data: {
                    userId: refUser.id,
                    eventId: event.id,
                    rating: faker_1.faker.number.int({ min: 4, max: 5 }),
                    comment: `Review Fen Kindle: ${faker_1.faker.lorem.sentence()}`,
                },
            });
        }
    }
    console.log("✅ Seed selesai: 20 event biasa, 3 high-traffic event, 15 user, 60+ transaksi, + transaksi khusus Fen Kindle");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
