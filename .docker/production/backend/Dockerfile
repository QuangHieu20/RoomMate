# Production Dockerfile for NestJS Backend
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation (this layer will be cached)
COPY backend/package.json ./
COPY backend/yarn.lock ./

# ==================== DEPENDENCIES STAGE ====================
FROM base AS dependencies

# Install all dependencies (including devDependencies for build)
# This layer will be cached if package.json and yarn.lock don't change
RUN yarn install --frozen-lockfile --network-timeout 1000000

# ==================== BUILD STAGE ====================
FROM dependencies AS build

# Copy source code (this layer will be rebuilt when source code changes)
COPY backend/ ./

# Build the application
RUN yarn build && \
    # Remove source maps and dev files to reduce image size
    find dist -name "*.map" -delete && \
    rm -rf src test node_modules/.cache

# ==================== PRODUCTION STAGE ====================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package.json ./
COPY backend/yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production --network-timeout 1000000 && \
    yarn cache clean && \
    # Remove unnecessary files
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.yarn

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Set user ID
USER 1000:1000

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]