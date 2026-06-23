-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nomecompleto" VARCHAR(255) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" BIGINT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "hashtags" VARCHAR(100)[],
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_username_fkey" FOREIGN KEY ("username") REFERENCES "usuarios"("username") ON DELETE CASCADE ON UPDATE CASCADE;
