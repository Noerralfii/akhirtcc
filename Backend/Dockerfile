# Gunakan image Node.js resmi
FROM node:18

# Atur timezone agar sesuai dengan Asia/Jakarta (opsional, tapi berguna untuk log yang sesuai)
ENV TZ=Asia/Jakarta

# Buat working directory
WORKDIR /app

# Salin file konfigurasi (gunakan wildcard untuk menangani package.json & package-lock.json jika ada)
COPY package*.json ./

# Install dependensi (gunakan --legacy-peer-deps jika error dependensi)
RUN npm install

# Salin semua source code
COPY . .

# Set environment variable default (Cloud Run bisa override)
ENV PORT=8080

# Buka port
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
