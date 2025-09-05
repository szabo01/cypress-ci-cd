FROM cypress/included:15.0.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g cypress-mochawesome-reporter
