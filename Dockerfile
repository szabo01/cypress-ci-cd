FROM cypress/included:15.0.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN cp -r node_modules /root/.cache/Cypress/15.0.0/Cypress/resources/app

