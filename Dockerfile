FROM node:24-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
RUN npx prisma generate
RUN pnpm run build

FROM node:24-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --ignore-scripts

COPY prisma ./prisma

RUN npx prisma@7.8.0 generate

COPY --from=builder /app/dist ./dist

ENV PORT=3001
EXPOSE 3001

CMD ["sh", "-c", "npx -y prisma@7.8.0 db push --accept-data-loss && node dist/main.js"]