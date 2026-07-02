FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install

# Копіюємо код
COPY . .
RUN DATABASE_URL="mysql://user:password@localhost:3306/dummy" npx prisma generate
RUN npm run build
FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]