FROM node:20-alpine

WORKDIR /app

# Installe util minimum pour le healthcheck (wget)
RUN apk add --no-cache wget

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5050

# Healthcheck côté image (en plus de celui compose)
HEALTHCHECK --interval=5s --timeout=2s --retries=20 \
  CMD wget -qO- http://localhost:5050/api/health || exit 1

CMD ["node", "server.js"]
