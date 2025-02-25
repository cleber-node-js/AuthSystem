FROM node:18-alpine

# Set the working directory
WORKDIR  mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY --chown=node:node . .

# Expose port
EXPOSE 3002

# Run the app
CMD ["npm", "run", "start"]