# Base image
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy remaining files
COPY . .

# Build the application
RUN npm run build

# ------------------------------------------

# Final image (production)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built dist folder
COPY --from=builder /app/dist ./dist

# Copy other files needed to run (optional: package.json for logging, etc.)
COPY package*.json ./

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 80

# Start the application
CMD ["npm", "start"]
