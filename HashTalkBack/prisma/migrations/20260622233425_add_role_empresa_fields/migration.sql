-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FUNCIONARIO', 'EMPRESA');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cargo_responsavel" VARCHAR(255),
ADD COLUMN     "nome_empresa" VARCHAR(255),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FUNCIONARIO';
