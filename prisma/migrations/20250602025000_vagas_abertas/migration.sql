-- CreateTable
CREATE TABLE "Vaga" (
    "idVaga" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aberta',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("idVaga")
);

-- CreateTable
CREATE TABLE "VagaCandidato" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "candidatoId" BIGINT NOT NULL,
    "etapa" TEXT NOT NULL DEFAULT 'Em processo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VagaCandidato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VagaCandidato_vagaId_candidatoId_key" ON "VagaCandidato"("vagaId", "candidatoId");

-- AddForeignKey
ALTER TABLE "VagaCandidato" ADD CONSTRAINT "VagaCandidato_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("idVaga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaCandidato" ADD CONSTRAINT "VagaCandidato_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidatos"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;
