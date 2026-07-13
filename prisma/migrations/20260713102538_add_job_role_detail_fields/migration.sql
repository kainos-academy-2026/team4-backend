-- AlterTable: add nullable columns first so existing rows are not blocked
ALTER TABLE "JobRole"
ADD COLUMN "description"           TEXT,
ADD COLUMN "responsibilities"      TEXT,
ADD COLUMN "numberOfOpenPositions" INTEGER,
ADD COLUMN "sharepointUrl"         TEXT;

-- Backfill placeholder values so existing rows satisfy NOT NULL
UPDATE "JobRole" SET
  "description"      = 'Placeholder description – update via seed or admin.',
  "responsibilities" = 'Placeholder responsibilities – update via seed or admin.'
WHERE "description" IS NULL OR "responsibilities" IS NULL;

-- Apply NOT NULL constraint now that all rows have values
ALTER TABLE "JobRole"
ALTER COLUMN "description"      SET NOT NULL,
ALTER COLUMN "responsibilities" SET NOT NULL;
