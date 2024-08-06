/*
  Warnings:

  - You are about to alter the column `amount` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - A unique constraint covering the columns `[title]` on the table `Catagory` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL DEFAULT 1000
);
INSERT INTO "new_User" ("amount", "email", "id", "password") SELECT "amount", "email", "id", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Catagory_title_key" ON "Catagory"("title");
