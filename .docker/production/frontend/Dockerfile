# Production Dockerfile for Nuxt.js Frontend
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation (this layer will be cached)
COPY frontend/package.json ./
COPY frontend/yarn.lock ./

# ==================== DEPENDENCIES STAGE ====================
FROM base AS dependencies

# Install all dependencies (including devDependencies for build)
# This layer will be cached if package.json and yarn.lock don't change
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --network-timeout 1000000 && \
    yarn cache clean

# ==================== BUILD STAGE ====================
FROM dependencies AS build

# Copy source code (this layer will be rebuilt when source code changes)
COPY frontend/ ./

# Set build environment variables
ENV NODE_ENV=production
ENV NUXT_PUBLIC_BASE_URL=https://todonest.id.vn
ENV NUXT_PUBLIC_API_BASE_URL=https://todonest.id.vn/api

# Build the application as static site
RUN yarn generate && \
    # Remove source maps and dev files to reduce image size
    find .output -name "*.map" -delete && \
    rm -rf .nuxt node_modules/.cache

# ==================== PRODUCTION STAGE ====================
FROM nginx:alpine AS production

# Copy built static files from build stage
COPY --from=build /app/.output/public /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

# Set environment variables
ENV NODE_ENV=production

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]