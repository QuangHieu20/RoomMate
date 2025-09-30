/*
  Warnings:

  - You are about to drop the column `fullname` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "fullname",
ADD COLUMN     "fullName" VARCHAR;
