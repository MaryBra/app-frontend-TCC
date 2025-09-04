# ---------- STAGE 1: Instalação das dependências ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Copia apenas o package.json e o lockfile para aproveitar o cache do Docker.
# As dependências só serão reinstaladas se esses arquivos mudarem.
COPY package.json package-lock.json ./
RUN npm ci

# ---------- STAGE 2: Build da Aplicação ----------
FROM deps AS builder
WORKDIR /app

# Copia o código-fonte da aplicação
COPY . .

# Executa o build de produção do Next.js
RUN npm run build

# ---------- STAGE 3: Imagem Final (Produção) ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV=production

# Copia os arquivos da build otimizada (standalone) do estágio 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Expõe a porta que o Next.js usa por padrão
EXPOSE 3000

# O comando para iniciar a aplicação em produção
CMD ["node", "server.js"]