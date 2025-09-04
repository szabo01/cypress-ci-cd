pipeline {
    agent any

    environment {
        REPORT_DIR = "cypress/reports/mochawesome-report"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/szabo01/cypress-ci-cd.git', branch: 'feature/cypress-pipeline', credentialsId: 'github-ssh-key'
            }
        }

        stage('Install & Run Cypress') {
            steps {
                script {
                    echo "Preparando ambiente..."
                    sh '''
                        rm -rf node_modules package-lock.json
                        mkdir -p /tmp/npm-cache
                        npm install --no-audit --no-fund --cache /tmp/npm-cache
                        echo "Rodando Cypress com Mochawesome..."
                        npx cypress run --reporter mochawesome \
                        --reporter-options reportDir=$REPORT_DIR,reportFilename=mochawesome,overwrite=false,html=true,json=true \
                        --browser chrome --headless
                    '''
                }
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/**/*", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
