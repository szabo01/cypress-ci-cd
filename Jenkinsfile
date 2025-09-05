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
                    def customImage = docker.build("cypress-tests:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Run Cypress Tests') {
            steps {
                echo 'Executando testes Cypress...'
                script {
                    def customImage = docker.image("cypress-tests:${env.BUILD_ID}")
                    
                    customImage.inside() {
                        sh '''
                            echo "Verificando estrutura do projeto..."
                            ls -la
                            
                            echo "Executando testes Cypress com mochawesome reporter..."
                            npm run cy:report
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finalizado!'
            
            script {
                if (fileExists('cypress/reports/html/index.html')) {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/html',
                        reportFiles: 'index.html',
                        reportName: 'Cypress Test Report'
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
            sh "docker rmi cypress-tests:${env.BUILD_ID} || true"
        }
    }
}