const { randomUUID } = require("crypto");
const { PrismaClient } = require("../app/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  await prisma.poll.createMany({
    data: [
      {
        question: "How do you eat your Maggi?",
        author: "vageesh",
        options: [
          { id: randomUUID(), text: "With a spoon" },
          { id: randomUUID(), text: "With a fork" },
          { id: randomUUID(), text: "hands are the best" },
        ],
      },
      {
        question: "Your house is on fire. What's the first thing you grab?",
        options: [
          { id: randomUUID(), text: "Phone" },
          { id: randomUUID(), text: "Snacks" },
          { id: randomUUID(), text: "That one charger that actually works" },
        ],
      },
      {
        question: "How do you handle awkward silences?",
        options: [
          { id: randomUUID(), text: "nervous laugh" },
          { id: randomUUID(), text: "Point at something random" },
          { id: randomUUID(), text: "Speak about cats" },
        ],
      },
    ],
  });

  console.log("created seed data");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
