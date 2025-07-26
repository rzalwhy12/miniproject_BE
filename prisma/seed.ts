// import { prisma } from "../src/config/prisma";
// import bcrypt from "bcrypt";
// import { EventCategory, Gender, Role } from "./generated/client";

// async function main() {
//   const hashedPassword = await bcrypt.hash("1234", 10);

//   // Create organizer user
//   const user = await prisma.user.create({
//     data: {
//       email: "organizer@example.com",
//       username: "organizer123",
//       name: "Event Organizer",
//       password: hashedPassword,
//       referralCode: `ORG${Math.floor(Math.random() * 10000)}`,
//       role: Role.ORGANIZER,
//       tanggalLahir: new Date("1990-05-01"),
//       jenisKelamin: Gender.MALE,
//     },
//   });

//   // Create tags
//   const tagNames = ["Tech", "Web", "Startup", "Design", "AI"];
//   const tags = await Promise.all(
//     tagNames.map((name) =>
//       prisma.tag.create({
//         data: { name },
//       })
//     )
//   );

//   // Create dummy events
//   const dummyEvents = [
//     {
//       name: "React Conference",
//       description: "Konferensi React terbesar di Asia Tenggara.",
//       syaratKetentuan: "Bawa laptop dan semangat belajar.",
//       category: EventCategory.CONFERENCE,
//       location: "Jakarta",
//       startDate: new Date("2025-08-15"),
//       endDate: new Date("2025-08-16"),
//     },
//     {
//       name: "Node.js Bootcamp",
//       description: "Belajar backend dengan Node.js dari nol.",
//       syaratKetentuan: "Bawa laptop dan Node.js terinstall.",
//       category: EventCategory.BOOTCAMP,
//       location: "Bandung",
//       startDate: new Date("2025-09-01"),
//       endDate: new Date("2025-09-03"),
//     },
//     {
//       name: "UX Design Sprint",
//       description: "Design thinking workshop.",
//       syaratKetentuan: "Bawa buku catatan.",
//       category: EventCategory.WORKSHOP,
//       location: "Jakarta",
//       startDate: new Date("2025-08-20"),
//       endDate: new Date("2025-08-21"),
//     },
//     {
//       name: "Startup Pitch Day",
//       description: "Pitch event untuk startup baru.",
//       syaratKetentuan: "Siapkan deck presentasi.",
//       category: EventCategory.EDUCATION,
//       location: "Surabaya",
//       startDate: new Date("2025-09-10"),
//       endDate: new Date("2025-09-10"),
//     },
//     {
//       name: "AI & Future Tech",
//       description:
//         "Seminar tentang kecerdasan buatan dan teknologi masa depan.",
//       syaratKetentuan: "Bawa identitas diri.",
//       category: EventCategory.FESTIVAL,
//       location: "Yogyakarta",
//       startDate: new Date("2025-10-01"),
//       endDate: new Date("2025-10-02"),
//     },
//   ];

//   for (const [index, event] of dummyEvents.entries()) {
//     const createdEvent = await prisma.event.create({
//       data: {
//         ...event,
//         statusEvent: "PUBLISHED",
//         organizerId: user.id,
//       },
//     });

//     // Add ticket types to each event
//     await prisma.ticketType.createMany({
//       data: [
//         {
//           name: "Early Bird",
//           price: 100000,
//           quota: 50,
//           eventId: createdEvent.id,
//         },
//         {
//           name: "Regular",
//           price: 150000,
//           quota: 100,
//           eventId: createdEvent.id,
//         },
//       ],
//     });

//     // Add 2 random tags to each event
//     const selectedTags = [
//       tags[index % tags.length],
//       tags[(index + 1) % tags.length],
//     ];
//     for (const tag of selectedTags) {
//       await prisma.eventTag.create({
//         data: {
//           eventId: createdEvent.id,
//           tagId: tag.id,
//         },
//       });
//     }
//   }

//   console.log("Dummy data seeded successfully.");
// }

// main()
//   .catch((e) => {
//     console.error("Error seeding data:", e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());
