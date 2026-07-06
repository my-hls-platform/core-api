
FROM node:24-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
RUN DATABASE_URL="mysql://user:pass@127.0.0.1:3306/dummy" npx prisma generate
RUN pnpm run build

FROM node:24-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --ignore-scripts

RUN pnpm add dotenv --ignore-scripts

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="mysql://user:pass@127.0.0.1:3306/dummy" npx prisma@7.8.0 generate

COPY --from=builder /app/dist ./dist

ENV PORT=3001
EXPOSE 3001

CMD ["sh", "-c", "(npx -y prisma@7.8.0 db push --accept-data-loss || true) && node dist/main.js"]