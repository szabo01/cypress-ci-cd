# Usar a imagem oficial do Cypress com Node.js e navegadores pré-instalados
FROM cypress/included:13.14.0

# Definir o diretório do trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY package.json package-lock.json ./
COPY cypress.config.js ./
COPY cypress ./cypress
COPY cypress/support ./cypress/support

# Instalar dependências
RUN npm install

# Definir o comando padrão (opicional, para testes locais)
CMD ["npm", "run", "cy:report"]