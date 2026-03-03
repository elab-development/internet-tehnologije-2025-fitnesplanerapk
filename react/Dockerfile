# ./react/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Kopiraj package.json i package-lock.json
COPY package.json package-lock.json ./

# Instaliraj dependencies
RUN npm install

# Kopiraj ceo projekat
COPY . .

# Expose port za Vite
EXPOSE 3000

# Pokreni Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]