FROM node:24-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --ignore-scripts

COPY . .
RUN DATABASE_URL="mysql://user:password@localhost:3306/dummy" npx prisma generate
RUN pnpm run build

FROM node:24-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --ignore-scripts

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV PORT=3001
EXPOSE 3001

CMD ["sh", "-c", "npx -y prisma db push --accept-data-loss && node dist/main.js"]