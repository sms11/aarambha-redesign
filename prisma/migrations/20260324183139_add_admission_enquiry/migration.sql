-- CreateTable
CREATE TABLE "AdmissionEnquiry" (
    "id" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "gradeApplied" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "previousSchool" TEXT,
    "guardianName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdmissionEnquiry_pkey" PRIMARY KEY ("id")
);
