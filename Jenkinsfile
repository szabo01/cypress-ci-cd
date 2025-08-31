pipeline {
    agent {
        docker {
            image 'cypress/included:15.0.0'
            args '--entrypoint=""'
        }
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/szabo01/cypress-ci-cd.git', branch: 'feature/cypress-pipeline'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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