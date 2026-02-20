-- CreateEnum
CREATE TYPE "BirthdayStatus" AS ENUM ('PENDING_GENERATION', 'GENERATING', 'READY_FOR_APPROVAL', 'APPROVED', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "BirthdayEvent" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "BirthdayStatus" NOT NULL,
    "layoutJson" JSONB,
    "htmlContent" TEXT,
    "approvedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BirthdayEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationLog" (
    "id" TEXT NOT NULL,
    "birthdayEventId" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "imageCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "birthdayEventId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "providerResponse" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BirthdayEvent_employeeId_year_key" ON "BirthdayEvent"("employeeId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationLog_birthdayEventId_key" ON "GenerationLog"("birthdayEventId");

-- AddForeignKey
ALTER TABLE "BirthdayEvent" ADD CONSTRAINT "BirthdayEvent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationLog" ADD CONSTRAINT "GenerationLog_birthdayEventId_fkey" FOREIGN KEY ("birthdayEventId") REFERENCES "BirthdayEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_birthdayEventId_fkey" FOREIGN KEY ("birthdayEventId") REFERENCES "BirthdayEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
