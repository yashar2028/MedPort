FROM node:18

# Set working directory
WORKDIR /app

# Copy and install only package.json + lock for caching
COPY ./frontend/package*.json ./

# Install dependencies (including redux toolkit etc.)
RUN npm install

# Copy the rest of the frontend code
COPY ./frontend ./

# Set environment variables inside container
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose port for development server
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]

