pipeline {
    agent {
        docker {
            image 'cypress/included:13.15.0'
            args '--entrypoint=""'
        }
    }
    environment {
        NPM_CONFIG_CACHE = '/tmp/npm-cache'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    mkdir -p /tmp/npm-cache
                    npm cache clean --force
                    npm install
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