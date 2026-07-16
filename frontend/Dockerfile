# Stage 1: Build Vite React SPA bundle
FROM node:22-alpine AS build
WORKDIR /app

# Copy package descriptors and install cleanly
COPY package*.json ./
RUN npm ci

# Copy source code and run production build
COPY . .
RUN npm run build

# Stage 2: Serve optimized static assets via Nginx Reverse Proxy
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
