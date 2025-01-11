-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Solwalletid" TEXT,
    "Usdwalletid" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solwallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "Solwallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsdWallet" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "UsdWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solwallet_UserId_key" ON "Solwallet"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "UsdWallet_UserId_key" ON "UsdWallet"("UserId");

-- AddForeignKey
ALTER TABLE "Solwallet" ADD CONSTRAINT "Solwallet_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsdWallet" ADD CONSTRAINT "UsdWallet_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
