# Production Dockerfile for Nuxt.js Frontend
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY frontend/package.json frontend/yarn.lock ./

# ==================== DEPENDENCIES STAGE ====================
FROM base AS dependencies

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile --network-timeout 1000000

# ==================== BUILD STAGE ====================
FROM dependencies AS build

# Copy source code
COPY frontend/ ./

# Build the application
RUN yarn build && \
    # Remove source maps and dev files to reduce image size
    find .output -name "*.map" -delete && \
    rm -rf .nuxt node_modules/.cache

# ==================== PRODUCTION STAGE ====================
FROM base AS production

# Install only production dependencies
RUN yarn install --frozen-lockfile --production --network-timeout 1000000 && \
    yarn cache clean && \
    # Remove unnecessary files
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.yarn

# Copy built application from build stage
COPY --from=build /app/.output ./

# Expose port 80 for frontend
EXPOSE 80

# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=80

# Add health check using localhost
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:80', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.mjs"]