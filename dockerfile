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

# Instala Chromium y las dependencias necesarias para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Configura Puppeteer para usar Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_OPTIONS="--max-old-space-size=4096"

# Crea un usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Copia node_modules desde el builder
COPY --from=builder /app/node_modules ./node_modules

# Copia package.json por convención
COPY --from=builder /app/package.json ./package.json

# Copia el código ya compilado
COPY --from=builder /app/dist ./dist

# Cambia la propiedad a nextjs user
RUN chown -R nextjs:nodejs /app

# Setea entorno
ENV NODE_ENV=production

# Cambia al usuario no-root
USER nextjs

EXPOSE 80

# Usa dumb-init para un mejor manejo de procesos
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]