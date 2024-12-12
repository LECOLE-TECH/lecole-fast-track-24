import { PrismaClient } from "@prisma/client";
import { createUser } from "../server/services/user.service.js";

const prisma = new PrismaClient();

async function main() {
  const seedUserData = [
    { username: "user1", roles: "user", secret_phrase: "123123" },
    { username: "admin1", roles: "admin", secret_phrase: "admin123" },
    { username: "user2", roles: "user", secret_phrase: "123123" },
    { username: "admin2", roles: "admin", secret_phrase: "admin456" },
    { username: "user3", roles: "user", secret_phrase: "123123" },
    { username: "user4", roles: "user", secret_phrase: "123123" },
    { username: "user5", roles: "user", secret_phrase: "123123" },
    { username: "user6", roles: "user", secret_phrase: "123123" },
    { username: "admin3", roles: "admin", secret_phrase: "admin789" },
    { username: "user7", roles: "user", secret_phrase: "123123" },
    { username: "user8", roles: "user", secret_phrase: "123123" },
    { username: "user9", roles: "user", secret_phrase: "123123" },
  ];

  for (const user of seedUserData) {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: user.username },
    });

    if (!existingUser) {
      // Create the user if it does not exist
      await createUser(user);
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
