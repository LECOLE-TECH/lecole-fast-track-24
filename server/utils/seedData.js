import { insertUser } from "../services/userService.js";

export const seedUsers = async () => {
  const users = [
    { username: "user1", roles: "user", secret_phrase: "secret123" },
    { username: "admin1", roles: "admin", secret_phrase: "admin123" },
    { username: "user2", roles: "user", secret_phrase: "secret456" },
    { username: "admin2", roles: "admin", secret_phrase: "admin456" }
  ];

  for (let user of users) {
    await insertUser(user.username, user.roles, user.secret_phrase);
  }

  console.log("Database seeded.");
};