/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PostDbo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "PostDbo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileDbo" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProfileDbo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDbo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "UserDbo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileDbo_userId_key" ON "ProfileDbo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDbo_email_key" ON "UserDbo"("email");

-- AddForeignKey
ALTER TABLE "PostDbo" ADD CONSTRAINT "PostDbo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserDbo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileDbo" ADD CONSTRAINT "ProfileDbo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserDbo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
