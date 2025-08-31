pipeline {
    agent {
        docker {
            image 'cypress/included:13.15.0'
            args '--entrypoint="" -u 0:0' // Roda como root para evitar problemas de permissões
        }
    }
    environment {
        NPM_CONFIG_CACHE = '/tmp/npm-cache'
        HOME = '/tmp' // Define HOME para evitar problemas com fontconfig
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    apt-get update && apt-get install -y libdbus-1-3 fontconfig
                    mkdir -p /tmp/npm-cache
                    rm -rf node_modules package-lock.json
                    npm cache clean --force
                    npm install --no-audit --no-fund
                '''
            }
        }
        stage('Run Cypress Tests') {
            steps {
                sh 'npm run cy:report'
            }
        }
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'cypress/reports/mochawesome-report/*.html', allowEmptyArchive: true
            }
        }
    }
    post {
        always {
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