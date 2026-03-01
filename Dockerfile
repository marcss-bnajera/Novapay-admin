# Usamos una imagen ligera de Node
FROM node:18-alpine

# Creamos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias primero (optimiza el cache)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código (incluyendo tu carpeta scr, configs, etc.)
COPY . .

# Exponemos el puerto que usa tu index.js (asumiendo que es el 3000)
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "index.js"]