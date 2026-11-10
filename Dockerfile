FROM node:22-alpine

WORKDIR /app

copy package*.json ./

RUN pnpm ci

COPY . .

RUN pnpm build

EXPOSE 5173

CMD ["pnpm", "preview", "--host"]