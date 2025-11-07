# === ETAPA 1: BUILDER ===
# Usamos Node 24 para construir el frontend.
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Compila la aplicación Vite/React, generando archivos estáticos en /dist.
RUN npm run build

# === ETAPA 2: SERVER ===
# Usamos la imagen oficial de Nginx, que es extremadamente pequeña y rápida.
FROM nginx:stable-alpine

# Copia los archivos estáticos compilados desde la etapa de builder
# a la carpeta desde donde Nginx sirve el contenido web.
COPY --from=builder /app/dist /usr/share/nginx/html

# Reemplaza la configuración por defecto de Nginx con la nuestra.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80, el estándar para tráfico web HTTP.
EXPOSE 80

# Comando para iniciar Nginx en primer plano, como Docker recomienda.
CMD ["nginx", "-g", "daemon off;"]