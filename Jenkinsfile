pipeline {
    agent any

    environment {
        REPORT_DIR = "cypress/reports/mochawesome-report"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/szabo01/cypress-ci-cd.git', 
                    branch: 'feature/cypress-pipeline', 
                    credentialsId: 'github-ssh-key'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    docker.image('cypress/included:13.15.0').inside {
                        echo "Preparando ambiente e rodando testes..."

                        sh '''
                            # Limpa node_modules e package-lock.json
                            rm -rf node_modules package-lock.json

                            # Cria cache temporário para npm
                            mkdir -p /tmp/npm-cache

                            # Instala dependências
                            npm install --no-audit --no-fund --cache /tmp/npm-cache

                            # Executa Cypress sem paralelização, com Mochawesome
                            npx cypress run \
                            --reporter mochawesome \
                            --reporter-options reportDir=$REPORT_DIR,reportFilename=mochawesome,overwrite=false,html=true,json=true \
                            --browser chrome --headless
                        '''
                    }
                }
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/**/*", allowEmptyArchive: false
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
