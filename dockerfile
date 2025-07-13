# ---------- Builder stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el código
RUN npm run build

# Copia los assets manualmente si no se generan en build
RUN cp -r src/recipe/assets dist/recipe/assets


# ---------- Final image ----------
FROM node:18-alpine

WORKDIR /app

# Copia node_modules desde el builder
COPY --from=builder /app/node_modules ./node_modules

# Copia package.json por convención
COPY --from=builder /app/package.json ./package.json

# Copia el código ya compilado
COPY --from=builder /app/dist ./dist

# Setea entorno
ENV NODE_ENV=production

EXPOSE 80

CMD ["npm", "start"]
