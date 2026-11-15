# Etapa 1: Dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# Etapa 2: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copia el archivo de entorno específico de producción como .env para que Next.js lo lea
COPY .env.production .env

# Construye la aplicación (ahora leerá la URL correcta automáticamente)
RUN npm run build

# Etapa 3: Producción
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copia los archivos necesarios del modo standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]