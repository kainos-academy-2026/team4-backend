-- Add a simple role flag so auth can separate admin and user access.
ALTER TABLE "User"
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
