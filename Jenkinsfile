pipeline {
    agent {
        docker {
            image 'cypress/included:13.15.0'
            args '--entrypoint="" -u 0:0 --privileged -v /tmp/.X11-unix:/tmp/.X11-unix'
        }
    }
    environment {
        NPM_CONFIG_CACHE = '/tmp/npm-cache'
        HOME = '/tmp'
        DISPLAY = ':0'
        FONTCONFIG_PATH = '/etc/fonts'
    }
    stages {
        stage('Checkout') {
            steps {
                sh 'rm -rf cypress/reports/mochawesome-report/*' // Remove arquivos do relatório para evitar conflitos
                cleanWs() // Limpa o workspace
                checkout scm // Faz o checkout do repositório
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                    mkdir -p /tmp/npm-cache
                    mkdir -p /tmp/.cache/fontconfig
                    chmod -R 777 /tmp/.cache
                    mkdir -p /run/dbus
                    rm -rf node_modules package-lock.json
                    npm cache clean --force
                    npm install --no-audit --no-fund --cache /tmp/npm-cache
                '''
            }
        }
        stage('Run Cypress Tests') {
            steps {
                sh 'npm run cy:report'
                sh 'chmod -R 777 cypress/reports/mochawesome-report' // Corrige permissões do relatório
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
            node('built-in') { // Usa o label correto do nó padrão
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