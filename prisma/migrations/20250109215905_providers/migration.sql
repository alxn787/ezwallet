/*
  Warnings:

  - Added the required column `Provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('google');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Provider" "Provider" NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
