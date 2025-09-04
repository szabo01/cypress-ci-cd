pipeline {
    agent any

    environment {
        REPORT_DIR = "cypress/reports/mochawesome-report"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/szabo01/cypress-ci-cd.git', 
                    branch: 'feature/cypress-pipeline', 
                    credentialsId: 'github-ssh-key'
            }
        }

        stage('Prepare Environment') {
            steps {
                script {
                    docker.image('cypress/included:13.15.0').inside {
                        echo "Preparando ambiente..."
                        sh '''
                            rm -rf node_modules package-lock.json
                            mkdir -p /tmp/npm-cache
                            npm install --no-audit --no-fund --cache /tmp/npm-cache
                        '''
                    }
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    docker.image('cypress/included:13.15.0').inside {
                        echo "Rodando Cypress com Mochawesome..."
                        sh '''
                            npx cypress run \
                            --reporter mochawesome \
                            --reporter-options reportDir=$REPORT_DIR,reportFilename=mochawesome,overwrite=false,html=true,json=true \
                            --browser chrome --headless
                        '''
                    }
                }
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/**/*", allowEmptyArchive: false
            }
        }
    }

    post {
        always {
            echo "Limpando workspace..."
            cleanWs()
        }
    }
}
