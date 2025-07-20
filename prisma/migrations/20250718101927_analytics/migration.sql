-- CreateTable
CREATE TABLE "formulario_analytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tipoForm" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "etapa" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "dadosEvento" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formulario_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversao_funil" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tipoForm" TEXT NOT NULL,
    "aberturaAt" TIMESTAMP(3),
    "preenchimentoAt" TIMESTAMP(3),
    "envioAt" TIMESTAMP(3),
    "tempoTotal" INTEGER,
    "etapasVisitadas" JSONB,
    "abandonouEm" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "cidade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversao_funil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "formulario_analytics_tipoForm_evento_idx" ON "formulario_analytics"("tipoForm", "evento");

-- CreateIndex
CREATE INDEX "formulario_analytics_sessionId_idx" ON "formulario_analytics"("sessionId");

-- CreateIndex
CREATE INDEX "formulario_analytics_createdAt_idx" ON "formulario_analytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversao_funil_sessionId_key" ON "conversao_funil"("sessionId");

-- CreateIndex
CREATE INDEX "conversao_funil_tipoForm_idx" ON "conversao_funil"("tipoForm");

-- CreateIndex
CREATE INDEX "conversao_funil_createdAt_idx" ON "conversao_funil"("createdAt");
