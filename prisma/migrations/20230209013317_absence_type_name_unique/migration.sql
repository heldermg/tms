/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `absence_type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "absence_type_name_key" ON "absence_type"("name");
