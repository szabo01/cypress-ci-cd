pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fazendo checkout do código...'
                checkout scm

                sh '''
                    echo "Limpando artefatos anteriores..."
                    rm -rf cypress/videos cypress/screenshots cypress/reports mochawesome.html || true
                    echo "Estrutura limpa!"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker...'
                script {
                    docker.build("cypress-ci-cd:${env.BUILD_ID}")
                }
            }
        }

        stage('Validate Reporter Package') {
            steps {
                echo 'Validando instalação do cypress-mochawesome-reporter...'
                sh """
                    docker run --rm \
                    -v \${PWD}:/app -w /app \
                    cypress-ci-cd:${env.BUILD_ID} \
                    ls node_modules/cypress-mochawesome-reporter || exit 1
                """
            }
        }

        stage('Run Cypress Tests') {
            steps {
                echo 'Executando testes Cypress...'
                sh """
                    docker run --rm \
                    -v \${PWD}:/app -w /app \
                    cypress-ci-cd:${env.BUILD_ID} \
                    sh -c '
                        npm run cy:report
                        echo "Verificando relatório gerado dentro do container..."
                        find /app -name "mochawesome.html"
                        test -f /app/cypress/reports/mochawesome-report/mochawesome.html && echo "Relatório gerado com sucesso." || echo "Relatório não encontrado."
                    '
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado!'

            script {
                def reportPath = 'cypress/reports/mochawesome-report/mochawesome.html'
                if (fileExists(reportPath)) {
                    sh 'ls -la cypress/reports/mochawesome-report'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/mochawesome-report',
                        reportFiles: 'mochawesome.html',
                        reportName: 'Cypress Mochawesome Report'
                    ])
                }

                if (fileExists('cypress/videos')) {
                    archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', fingerprint: true
                }

                if (fileExists('cypress/screenshots')) {
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', fingerprint: true
                }
            }
        }

        success {
            echo 'Testes executados com sucesso! ✅'
        }

        failure {
            echo 'Falha na execução dos testes! ❌'
        }

        cleanup {
            echo 'Limpando recursos...'
            sh "docker rmi cypress-ci-cd:${env.BUILD_ID} || true"
        }
    }
}
