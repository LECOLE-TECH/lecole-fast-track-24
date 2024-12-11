-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "secret_phrase" TEXT NOT NULL,
    "roles" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("roles", "secret_phrase", "user_id", "username") SELECT "roles", "secret_phrase", "user_id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
