# Use a imagem oficial do Cypress com browsers
FROM cypress/browsers:node18.12.0-chrome107-ff107-edge

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para o cypress)
RUN npm ci

# Copiar todo o código
COPY . .

# Verificar se o Cypress foi instalado corretamente
RUN npx cypress verify

# Comando padrão para rodar os testes com relatório
CMD ["npm", "run", "cy:report"]