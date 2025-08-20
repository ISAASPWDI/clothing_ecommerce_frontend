# Etapa 1: Build
FROM node:20-alpine AS builder

# Crea el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias y construir
COPY package*.json .

# Instala dependencias (sin devDependencies si usas --production)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto (Next.js)
RUN npm run build

# Comando para iniciar la app en modo producción
CMD ["npm", "start"]
