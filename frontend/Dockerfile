# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy everything (simpler approach)
COPY . .

# Install dependencies
RUN npm install

# Build the application
ENV REACT_APP_API_URL=http://localhost:5000/api
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]