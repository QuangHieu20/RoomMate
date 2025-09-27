FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies một lần duy nhất
COPY backend/package.json backend/yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Build
COPY backend/ ./
RUN yarn build

FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init wget
WORKDIR /app

# Copy built files và node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules  
COPY --from=builder /app/dist ./dist

# Xóa dev dependencies mà không download gì
RUN npm prune --production

USER 1000:1000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider https://roommate.id.vn/health|| exit 1
CMD ["dumb-init", "node", "dist/main.js"]