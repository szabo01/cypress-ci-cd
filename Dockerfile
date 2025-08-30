# Use official Cypress image with Node.js and browsers pre-installed
FROM cypress/included:15.0.0
WORKDIR /app
COPY package.json package-lock.json ./
# Install all dependencies, including devDependencies
RUN npm install
COPY . .
# Mitigate dbus errors
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null
RUN apt-get update && apt-get install -y dbus