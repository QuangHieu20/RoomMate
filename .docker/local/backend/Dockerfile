FROM node:20-alpine AS development
LABEL authors="nguyenquanghieu"

WORKDIR /app

COPY package*.json ./

RUN yarn install && yarn cache clean --force

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]