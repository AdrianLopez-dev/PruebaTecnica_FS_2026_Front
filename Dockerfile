# Etapa 1: Build
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm ci --only=development

COPY . .
RUN npm run build

# Etapa 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist/prueba-tecnica-fs-2026-front /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
