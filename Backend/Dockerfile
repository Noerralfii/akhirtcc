FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies first (better Docker caching)
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]
