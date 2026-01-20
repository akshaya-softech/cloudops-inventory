# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

LABEL maintainer="CloudOps Team"
LABEL version="1.0.0"
LABEL description="CloudOps Inventory Platform - Backend API"

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci)
RUN npm install --omit=dev

# Copy application code
COPY src/ ./src/

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "src/index.js"]