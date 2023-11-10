/*
  Warnings:

  - Added the required column `imagePath` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `imagePath` VARCHAR(191) NOT NULL;
