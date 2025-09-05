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
                    docker.build("cypress-tests:${env.BUILD_ID}")
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                echo 'Executando testes Cypress...'
                sh """
                    docker run --rm --entrypoint='' \
                    -v \$PWD:/app -w /app \
                    cypress-tests:${env.BUILD_ID} \
                    npm run cy:report
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado!'

            script {
                // Validação do relatório HTML gerado pelo mochawesome
                def reportPath = 'cypress/reports/mochawesome-report/mochawesome.html'
                if (fileExists(reportPath)) {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/mochawesome-report',
                        reportFiles: 'mochawesome.html',
                        reportName: 'Cypress Mochawesome Report'
                    ])
                }

                // Arquivamento de vídeos e screenshots
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
            sh "docker rmi cypress-tests:${env.BUILD_ID} || true"
        }
    }
}
