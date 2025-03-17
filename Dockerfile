FROM node:20-alpine

# Set the working directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@11.2.0 && npm ci

# Copy the rest of the app
COPY --chown=node:node . .

# Expose port
EXPOSE 3002

# Run the app
CMD ["npm", "run", "start"]
