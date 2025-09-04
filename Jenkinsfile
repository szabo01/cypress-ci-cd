pipeline {
    agent none

    stages {
        stage('Checkout') {
            agent { label 'built-in' }
            steps {
                // Limpa o workspace antes de iniciar
                cleanWs()
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/feature/cypress-pipeline']],
                    userRemoteConfigs: [[url: 'https://github.com/szabo01/cypress-ci-cd.git']]
                ])
            }
        }

        stage('Install & Run Cypress') {
            agent {
                docker {
                    image 'cypress/included:13.15.0'
                    args '--user 0:0 --privileged'
                }
            }
            environment {
                NPM_CONFIG_CACHE = '/tmp/npm-cache'
                HOME = '/tmp'
                DISPLAY = ':1'
                FONTCONFIG_PATH = '/etc/fonts'
            }
            steps {
                sh '''
                    rm -rf node_modules package-lock.json
                    mkdir -p /tmp/npm-cache
                    npm install --no-audit --no-fund --cache /tmp/npm-cache
                    npm run cy:report
                '''
            }
        }

        stage('Archive Report') {
            agent { label 'built-in' }
            steps {
                archiveArtifacts artifacts: 'cypress/reports/mochawesome-report/*.html', allowEmptyArchive: true
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'cypress/reports/mochawesome-report',
                    reportFiles: 'mochawesome.html',
                    reportName: 'Relatório de Testes Cypress'
                ])
            }
        }
    }
}
