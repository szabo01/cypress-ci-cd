pipeline {
    agent any

    environment {
        NPM_CACHE = "/tmp/npm-cache"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    docker.image('cypress/included:13.15.0').inside {
                        sh '''
                            echo "Instalando dependências..."
                            rm -rf node_modules package-lock.json
                            mkdir -p $NPM_CACHE
                            npm install --no-audit --no-fund --cache $NPM_CACHE

                            echo "Rodando testes Cypress..."
                            npx cypress run --browser chrome --headless --reporter mochawesome --reporter-options reportDir=cypress/reports,overwrite=false,html=true,json=true
                        '''
                    }
                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'cypress/reports/*.html', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado."
        }
    }
}
