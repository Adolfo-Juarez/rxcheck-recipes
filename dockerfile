# Base image
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm install

# Copy remaining files
COPY . .

# Build the application
RUN npm run build

# ------------------------------------------

# Final image (production)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built dist folder
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/recipe/assets ./dist/recipe/assets

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 80

# Start the application
CMD ["npm", "start"]