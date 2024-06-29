
FROM node:20-slim

# Install openssl and procps (includes ps command)
RUN apt-get update -y && apt-get install -y openssl procps

# Create app directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon for hot reload
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Change ownership of the app directory
RUN chown -R node:node /home/node/app

# Use a non-root user
USER node

# Expose the port the app runs on
EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["nodemon", "--watch", "src", "--exec", "npm", "run", "start:dev"]
