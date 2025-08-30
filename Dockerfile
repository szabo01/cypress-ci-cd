FROM cypress/included:15.0.0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
