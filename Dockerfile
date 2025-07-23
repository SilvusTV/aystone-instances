# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build -- --ignore-ts-errors

# Expose ports
EXPOSE 3333
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
