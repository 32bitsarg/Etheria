-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "wood" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "iron" DOUBLE PRECISION NOT NULL DEFAULT 300,
    "gold" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "populationUsed" INTEGER NOT NULL DEFAULT 0,
    "populationMax" INTEGER NOT NULL DEFAULT 200,
    "lastResourceUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alliance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllianceMember" (
    "id" TEXT NOT NULL,
    "allianceId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rank" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllianceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructionQueueItem" (
    "id" TEXT NOT NULL,
    "buildingType" TEXT NOT NULL,
    "targetLevel" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3) NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConstructionQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingQueueItem" (
    "id" TEXT NOT NULL,
    "unitType" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3) NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Alliance_name_key" ON "Alliance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Alliance_tag_key" ON "Alliance"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceMember_playerId_key" ON "AllianceMember"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "AllianceMember_allianceId_playerId_key" ON "AllianceMember"("allianceId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "City_playerId_key" ON "City"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Building_cityId_type_key" ON "Building"("cityId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_cityId_type_key" ON "Unit"("cityId", "type");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceMember" ADD CONSTRAINT "AllianceMember_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllianceMember" ADD CONSTRAINT "AllianceMember_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionQueueItem" ADD CONSTRAINT "ConstructionQueueItem_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingQueueItem" ADD CONSTRAINT "TrainingQueueItem_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
