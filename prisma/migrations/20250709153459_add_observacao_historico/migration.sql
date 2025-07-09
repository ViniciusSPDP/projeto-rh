-- CreateTable
CREATE TABLE "ObservacaoHistorico" (
    "id" SERIAL NOT NULL,
    "candidatoId" BIGINT NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ObservacaoHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ObservacaoHistorico_candidatoId_idx" ON "ObservacaoHistorico"("candidatoId");

-- AddForeignKey
ALTER TABLE "ObservacaoHistorico" ADD CONSTRAINT "ObservacaoHistorico_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidatos"("idCandidato") ON DELETE CASCADE ON UPDATE CASCADE;
