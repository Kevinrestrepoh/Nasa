FROM ubuntu:rolling

# Install vips
RUN apt-get update && apt-get install -y \
    libvips-tools \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
