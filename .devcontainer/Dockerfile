FROM node:18-bullseye

# Install PHP and PostgreSQL dependencies
RUN apt-get update && \
    apt-get install -y php php-pgsql php-mbstring php-xml php-curl composer

# Set working directory
WORKDIR /workspace
