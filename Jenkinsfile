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

        stage('Validate Reporter Package') {
            steps {
                echo 'Validando instalação do cypress-mochawesome-reporter...'
                sh """
                    docker run --rm \
                    -v \${PWD}:/app -w /app \
                    ${env.DOCKER_IMAGE} \
                    ls node_modules/cypress-mochawesome-reporter
                """
            }
        }

        stage('Run Cypress Tests') {
            steps {
                echo 'Executando testes Cypress...'
                
                // Executar os testes cypress
                sh """
                    docker run --rm \
                    -v \${PWD}:/app -w /app \
                    ${env.DOCKER_IMAGE} \
                    npm run cy:report
                """
                
                // Organizar os relatórios
                sh """
                    echo "Organizando relatórios..."
                    mkdir -p cypress/reports/mochawesome-report
                    
                    # Verificar se o relatório foi gerado e movê-lo
                    if [ -f mochawesome-report/mochawesome.html ]; then
                        mv mochawesome-report/mochawesome.html cypress/reports/mochawesome-report/
                        echo "Relatório movido com sucesso!"
                    elif [ -f mochawesome.html ]; then
                        mv mochawesome.html cypress/reports/mochawesome-report/
                        echo "Relatório movido da raiz com sucesso!"
                    else
                        echo "Relatório não encontrado!"
                        find . -name "mochawesome.html" -type f
                        exit 1
                    fi
                    
                    # Verificar se o arquivo final existe
                    if [ -f cypress/reports/mochawesome-report/mochawesome.html ]; then
                        echo "Relatório final confirmado em cypress/reports/mochawesome-report/mochawesome.html"
                        ls -la cypress/reports/mochawesome-report/
                    else
                        echo "ERRO: Relatório final não encontrado!"
                        exit 1
                    fi
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado!'

            script {
                def reportPath = 'cypress/reports/mochawesome-report/mochawesome.html'
                
                echo "Verificando existência do relatório em: ${reportPath}"
                
                if (fileExists(reportPath)) {
                    echo 'Relatório encontrado! Publicando...'
                    sh 'ls -la cypress/reports/mochawesome-report/'
                    
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/mochawesome-report',
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