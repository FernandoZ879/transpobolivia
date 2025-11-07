# === ETAPA 1: BUILDER ===
# Usamos una imagen completa de Node 24 para instalar dependencias y compilar.
# 'alpine' es una versión ligera de Linux, ideal para contenedores.
FROM node:24-alpine AS builder

WORKDIR /app

# Copia los archivos de manifiesto y lock para aprovechar el caché de Docker.
COPY package*.json ./

# Instala TODAS las dependencias, incluyendo las de desarrollo (typescript, etc.).
RUN npm install

# Copia el resto del código fuente del backend.
COPY . .

# Compila el código TypeScript a JavaScript en la carpeta /dist.
RUN npm run build

# === ETAPA 2: PRODUCTION ===
# Empezamos desde una imagen fresca y aún más ligera.
FROM node:24-alpine

WORKDIR /app

# Copia los manifiestos desde la etapa de builder.
COPY --from=builder /app/package*.json ./

# ¡OPTIMIZACIÓN CLAVE! Instala ÚNICAMENTE las dependencias de producción.
# Esto reduce drásticamente el tamaño de la imagen final.
RUN npm install --only=production

# Copia la aplicación ya compilada desde la etapa de builder.
COPY --from=builder /app/dist ./dist

# Expone el puerto que la aplicación NestJS usa internamente.
EXPOSE 3000

# El comando para iniciar la aplicación en modo producción.
CMD ["node", "dist/main"]