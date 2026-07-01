-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

-- Promove os usuários já autorizados a ADMIN (bootstrap do RBAC).
-- Decisão do dono: todo usuário com autorizado = true vira ADMIN.
UPDATE "usuario" SET "role" = 'ADMIN' WHERE "autorizado" = true;
