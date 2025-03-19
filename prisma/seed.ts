import prisma from "../lib/prisma";

async function main() {
  const response = await Promise.all([
    prisma.user.upsert({
      where: { email: "teste@vercel.com" },
      update: {},
      create: {
        name: "Usuario Teste",
        email: "teste@vercel.com",
        password: "123456",
      },
    }),
  ]);
  console.log(response);
}

main()
  .then(() => {
    console.log("Seed script completed successfully.");
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
