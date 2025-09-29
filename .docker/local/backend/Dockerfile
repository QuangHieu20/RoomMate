FROM node:20-alpine

WORKDIR /app

# Install dependencies globally
RUN yarn global add @nestjs/cli

EXPOSE 3000

# Install dependencies when container starts (mounted from host)
CMD ["sh", "-c", "yarn install && yarn start:dev --watch"]