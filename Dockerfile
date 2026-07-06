FROM node:24-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
RUN DATABASE_URL="mysql://user:password@localhost:3306/dummy" npx prisma generate
RUN pnpm run build

ENV PORT=3001
EXPOSE 3001

CMD ["sh", "-c", "(npx -y prisma@7.8.0 db push --accept-data-loss || true) && node dist/main.js"]