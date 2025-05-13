# Use the official Node.js image as base
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies for both client and server
FROM base AS deps
# Copy package.json files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies with cache optimization
RUN cd server && npm ci --only=production && \
    cd ../client && npm ci --only=production

# Build the client
FROM base AS client-builder
WORKDIR /app
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client ./client
# Set environment variables for production build
ENV NODE_ENV=production
ENV REACT_APP_API_URL=/api
RUN cd client && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy built client to server's public directory
COPY --from=client-builder /app/client/build ./server/public
# Copy server files
COPY server/package*.json ./server/
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server ./server

# Set the correct permission
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Set working directory to server
WORKDIR /app/server

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
