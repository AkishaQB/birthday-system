/*
  Warnings:

  - Made the column `senderEmail` on table `BirthdayEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BirthdayEvent" ALTER COLUMN "senderEmail" SET NOT NULL;
