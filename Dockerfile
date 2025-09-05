# Use cypress/included que já tem tudo configurado
FROM cypress/included:latest

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar todo o código
COPY . .

# Comando padrão para rodar os testes com relatório
CMD ["npm", "run", "cy:report"]