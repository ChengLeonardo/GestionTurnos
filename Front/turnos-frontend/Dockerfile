# Usamos Node 20 (imagen oficial)
FROM node:20

# Creamos el directorio dentro del contenedor
WORKDIR /app

# Copiamos solo package.json y package-lock.json (si existiera)
COPY package.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el proyecto (esto es para producción, en dev usamos volume)
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Comando por defecto para desarrollo en vivo
CMD ["npm", "run", "dev"]
