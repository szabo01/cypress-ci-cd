pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        DOCKER_IMAGE = "cypress-ci-cd:${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fazendo checkout do código...'
                checkout scm

                sh '''
                    echo "Limpando artefatos anteriores..."
                    rm -rf cypress/videos cypress/screenshots cypress/reports mochawesome.html mochawesome-report || true
                    echo "Estrutura limpa!"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker...'
                script {
                    docker.build(env.DOCKER_IMAGE)
                }
            }
        }
        
        stage('Run Cypress Tests') {
            steps {
                echo 'Executando testes Cypress...'
                script {
                    def container = docker.run("-d -e DBUS_SESSION_BUS_ADDRESS=/dev/null", env.DOCKER_IMAGE)
                    try {
                        sh "docker exec ${container.id} npx cypress run"
                        echo "Copiando relatórios e artefatos para o workspace do Jenkins..."
                        sh "docker cp ${container.id}:/app/cypress/reports cypress/"
                        sh "docker cp ${container.id}:/app/cypress/videos cypress/"
                        sh "docker cp ${container.id}:/app/cypress/screenshots cypress/"
                    } finally {
                        echo "Limpando o contêiner..."
                        sh "docker stop ${container.id}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado!'

            script {
                def reportPath = 'cypress/reports/mochawesome.html'
                
                echo "Verificando existência do relatório em: ${reportPath}"
                
                if (fileExists(reportPath)) {
                    echo 'Relatório encontrado! Publicando...'
                    sh 'ls -la cypress/reports/'
                    
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports',
                        reportFiles: 'mochawesome.html',
                        reportName: 'Cypress Mochawesome Report',
                        reportTitles: 'Relatório de Testes Cypress'
                    ])
                    
                    echo 'Relatório publicado com sucesso!'
                } else {
                    echo 'Relatório não encontrado. Listando arquivos disponíveis...'
                    sh '''
                        echo "Estrutura do workspace:"
                        find . -name "*.html" -type f
                        echo "Conteúdo do diretório cypress:"
                        ls -la cypress/ || echo "Diretório cypress não existe"
                        echo "Conteúdo do diretório reports (se existir):"
                        ls -la cypress/reports/ || echo "Diretório reports não existe"
                    '''
                }
            }

            script {
                // Arquivar vídeos se existirem
                if (fileExists('cypress/videos')) {
                    echo 'Arquivando vídeos dos testes...'
                    archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', fingerprint: true, allowEmptyArchive: true
                }

                // Arquivar screenshots se existirem
                if (fileExists('cypress/screenshots')) {
                    echo 'Arquivando screenshots dos testes...'
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        success {
            echo 'Testes executados com sucesso! ✅'
        }

        failure {
            echo 'Falha na execução dos testes! ❌'
            
            // Debug em caso de falha
            script {
                sh '''
                    echo "=== DEBUG: Listando todos os arquivos HTML ==="
                    find . -name "*.html" -type f
                    echo "=== DEBUG: Estrutura completa do workspace ==="
                    ls -la
                    echo "=== DEBUG: Conteúdo do diretório cypress (se existir) ==="
                    ls -la cypress/ || echo "Diretório cypress não existe"
                '''
            }
        }

        cleanup {
            echo 'Limpando recursos...'
            sh "docker rmi ${env.DOCKER_IMAGE} || true"
        }
    }
}