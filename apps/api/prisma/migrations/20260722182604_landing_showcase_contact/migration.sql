-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "interest" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "deliveryDate" DATETIME,
    "accessToken" TEXT NOT NULL,
    "tokenExpiresAt" DATETIME,
    "lastAccessedAt" DATETIME,
    "showcase" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("accessToken", "clientId", "createdAt", "deliveryDate", "description", "endDate", "id", "lastAccessedAt", "name", "startDate", "status", "tokenExpiresAt", "updatedAt") SELECT "accessToken", "clientId", "createdAt", "deliveryDate", "description", "endDate", "id", "lastAccessedAt", "name", "startDate", "status", "tokenExpiresAt", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_accessToken_key" ON "Project"("accessToken");
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
