       # Pipeline CI/CD com Cypress

       Este projeto implementa um pipeline CI/CD para testes end-to-end com [Cypress](https://www.cypress.io/) usando Docker, integrado com GitHub Actions e Jenkins. Os testes são executados em um contêiner Docker (`cypress/included:15.0.0`), e os relatórios são gerados com `cypress-mochawesome-reporter`, publicados no Jenkins ou no GitHub Pages.

       ## Objetivo
       Automatizar testes end-to-end para uma aplicação de exemplo (to-do) e publicar relatórios de teste em um site público ou no dashboard do Jenkins, demonstrando proficiência em múltiplas ferramentas CI/CD e boas práticas de versionamento com Git.

       ## Tecnologias Utilizadas
       - **Cypress**: Framework de testes end-to-end.
       - **Docker**: Contêiner para testes usando `cypress/included:15.0.0`.
       - **Jenkins**: Pipeline CI/CD para executar testes e arquivar relatórios.
       - **GitHub Actions**: Pipeline CI/CD alternativo para publicar relatórios no GitHub Pages.
       - **cypress-mochawesome-reporter**: Gera relatórios HTML.
       - **GitHub Pages**: Hospeda relatórios de teste (para o pipeline do GitHub Actions).

       ## Pré-requisitos
       - **Docker Desktop**: Instalado e configurado (com integração WSL 2 no Windows).
       - **Node.js**: Versão 20.x (incluído no contêiner Docker).
       - **Git**: Para clonar o repositório.
       - **Jenkins**: Instalado no Ubuntu 24.04 (WSL 2) com plugins Docker e Docker Pipeline.
       - **WSL 2** (opcional): Para execução no Windows com Ubuntu 24.04.

       ## Configuração Local
       1. **Clonar o repositório**:
          ```bash
          git clone https://github.com/szabo01/cypress-ci-cd.git
          cd cypress-ci-cd
          ```
       2. **Construir a imagem Docker**:
          ```bash
          docker build -t cypress-ci-cd .
          ```
       3. **Executar os testes**:
          ```bash
          docker run --rm -v $(pwd):/app cypress-ci-cd npm run cy:report
          ```
          - Os relatórios são gerados em `cypress/reports/mochawesome-report/mochawesome.html`.

       ## Configuração do Pipeline Jenkins
       1. **Instalar o Jenkins**:
          ```bash
          sudo apt update
          sudo apt install -y openjdk-17-jdk
          curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo apt-key add -
          echo "deb https://pkg.jenkins.io/debian binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list
          sudo apt update
          sudo apt install -y jenkins
          ```
          - Habilitar `systemd` no WSL 2:
            ```bash
            sudo nano /etc/wsl.conf
            ```
            Adicione:
            ```
            [boot]
            systemd=true
            ```
            Reinicie o WSL no PowerShell:
            ```powershell
            wsl --shutdown
            wsl
            ```
            Inicie o Jenkins:
            ```bash
            sudo systemctl start jenkins
            sudo systemctl enable jenkins
            ```
       2. **Configurar o Docker**:
          ```bash
          sudo usermod -aG docker jenkins
          sudo systemctl restart jenkins
          ```
       3. **Instalar plugins do Docker**:
          - No Jenkins, vá para **Gerenciar Jenkins > Gerenciar Plugins**.
          - Instale **Docker plugin** (versão 1274.vc0203fdf2e74) e **Docker Pipeline plugin** (versão 621.va_73f881d9232).
       4. **Criar um Pipeline**:
          - Use o `Jenkinsfile` na branch `feature/cypress-pipeline` (depois mesclar na `main`).
          - Acesse os relatórios em `http://localhost:8080/job/cypress-ci-cd/` em "Relatório de Testes Cypress".

       ## Configuração do Pipeline GitHub Actions
       - Configurado em `.github/workflows/ci.yml`.
       - Acionado em pushes/pull requests para os branches `main` e `develop`.
       - Publica relatórios no GitHub Pages.

       ## Boas Práticas de Versionamento
       - Desenvolvimento realizado em branches de feature (ex.: `feature/cypress-pipeline`).
       - Commits atômicos com mensagens claras (ex.: "Adiciona Jenkinsfile para pipeline CI/CD").
       - Revisão e mesclagem via Pull Requests para garantir qualidade e rastreabilidade.
       - Branch `main` mantém o código estável e pronto para produção.

       ## Visualização dos Relatórios
       - **Jenkins**: Acesse em `http://localhost:8080/job/cypress-ci-cd/` em "Relatório de Testes Cypress".
       - **GitHub Pages** (GitHub Actions): [https://szabo01.github.io/cypress-ci-cd/](https://szabo01.github.io/cypress-ci-cd/)
         - Relatório de teste: [https://szabo01.github.io/cypress-ci-cd/reports/<run_id>/mochawesome.html](https://szabo01.github.io/cypress-ci-cd/reports/<run_id>/mochawesome.html)
         - Exemplo: [https://szabo01.github.io/cypress-ci-cd/reports/17336169589/mochawesome.html](https://szabo01.github.io/cypress-ci-cd/reports/17336169589/mochawesome.html)

       ## Estrutura do Projeto
       ```
       cypress-ci-cd/
       ├── cypress/
       │   ├── e2e/
       │   │   └── todo.cy.js          # Arquivos de teste Cypress
       │   ├── reports/
       │   │   └── mochawesome-report/ # Relatórios gerados localmente
       │   └── support/
       │       ├── commands.js         # Comandos personalizados
       │       └── e2e.js              # Configuração global
       ├── .github/
       │   └── workflows/
       │       └── ci.yml              # Pipeline GitHub Actions
       ├── cypress.config.js            # Configuração do Cypress
       ├── Dockerfile                  # Definição do contêiner Docker
       ├── Jenkinsfile                  # Definição do pipeline Jenkins
       ├── package.json                # Dependências e scripts
       └── README.md                   # Documentação do projeto
       ```

       ## Contribuição
       1. Faça um fork do repositório.
       2. Crie um branch de feature (`git checkout -b feature/nova-funcionalidade`).
       3. Commit suas alterações (`git commit -m "Adiciona nova funcionalidade"`).
       4. Push para o branch (`git push origin feature/nova-funcionalidade`).
       5. Abra um Pull Request.

       ## Contato
       - Autor: Robson Szabo
       - Email: robsonszabo@yahoo.com.br
       - GitHub: [szabo01](https://github.com/szabo01)
       ```
