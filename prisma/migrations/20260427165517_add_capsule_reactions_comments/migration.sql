-- CreateTable
CREATE TABLE "CapsuleReaction" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '❤️',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapsuleReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapsuleComment" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "name" TEXT,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapsuleComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CapsuleReaction_capsuleId_idx" ON "CapsuleReaction"("capsuleId");

-- CreateIndex
CREATE INDEX "CapsuleComment_capsuleId_idx" ON "CapsuleComment"("capsuleId");
