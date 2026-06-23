-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "empresa_id" INTEGER;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
