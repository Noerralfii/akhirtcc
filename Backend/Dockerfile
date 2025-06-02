# Gunakan image Node.js resmi
FROM node:18

# Buat working directory
WORKDIR /app

# Salin file konfigurasi
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua source code
COPY . .

# Set environment variable (Cloud Run akan override dari Secret Manager / dashboard)
ENV PORT=8080

# Buka port yang digunakan server
EXPOSE 8080

# Perintah untuk menjalankan server
CMD ["npm", "start"]
