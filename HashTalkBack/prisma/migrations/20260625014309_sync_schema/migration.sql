/*
  Warnings:

  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `timestamp` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `posts` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `usuario_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_username_fkey";

-- AlterTable
CREATE SEQUENCE posts_id_seq;
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
DROP COLUMN "timestamp",
DROP COLUMN "username",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuario_id" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('posts_id_seq'),
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE posts_id_seq OWNED BY "posts"."id";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
