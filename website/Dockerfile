# Use the official Node.js 20 image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of your application code
COPY . .

RUN npm run build

# Expose the port your app runs on (adjust if necessary)
EXPOSE 8080

ENV PORT 8080

# Define the command to run your app
CMD ["npm", "start"]
