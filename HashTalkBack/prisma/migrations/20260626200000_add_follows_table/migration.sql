CREATE TABLE IF NOT EXISTS "follows" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followedId" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "follows"
ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "follows_followerId_followedId_key"
ON "follows"("followerId", "followedId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'follows_followerId_fkey'
    ) THEN
        ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey"
        FOREIGN KEY ("followerId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'follows_followedId_fkey'
    ) THEN
        ALTER TABLE "follows" ADD CONSTRAINT "follows_followedId_fkey"
        FOREIGN KEY ("followedId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
