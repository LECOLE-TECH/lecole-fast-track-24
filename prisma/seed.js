import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const seedUserData = [
    { username: "user1", roles: "user", secret_phrase: "secret123" },
    { username: "admin1", roles: "admin", secret_phrase: "admin123" },
    { username: "user2", roles: "user", secret_phrase: "secret456" },
    { username: "admin2", roles: "admin", secret_phrase: "admin456" },
    { username: "user3", roles: "user", secret_phrase: "secret789" },
    { username: "user4", roles: "user", secret_phrase: "secret101" },
    { username: "user5", roles: "user", secret_phrase: "secret102" },
    { username: "user6", roles: "user", secret_phrase: "secret103" },
    { username: "admin3", roles: "admin", secret_phrase: "admin789" },
    { username: "user7", roles: "user", secret_phrase: "secret104" },
    { username: "user8", roles: "user", secret_phrase: "secret105" },
    { username: "user9", roles: "user", secret_phrase: "secret106" },
  ];

  for (const user of seedUserData) {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: user.username },
    });

    if (!existingUser) {
      // Create the user if it does not exist
      await prisma.user.create({ data: user });
      console.log(`Created user: ${user.username}`);
    } else {
      console.log(`User already exists: ${user.username}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
