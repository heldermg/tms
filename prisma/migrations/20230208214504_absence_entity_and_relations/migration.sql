-- CreateTable
CREATE TABLE "absence_type" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "absence_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absence" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "startDateAt" DATE NOT NULL,
    "endDateAt" DATE NOT NULL,
    "startTimeAt" TIME NOT NULL,
    "endTimeAt" TIME NOT NULL,
    "isAllDay" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "absenceTypeId" TEXT NOT NULL,

    CONSTRAINT "absence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "absence" ADD CONSTRAINT "absence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absence" ADD CONSTRAINT "absence_absenceTypeId_fkey" FOREIGN KEY ("absenceTypeId") REFERENCES "absence_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
