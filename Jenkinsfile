pipeline {
    agent any

    environment {
        NODE_OPTIONS = '--max-old-space-size=4096'
        CYPRESS_CACHE_FOLDER = '/tmp/.cache/Cypress'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/feature/cypress-pipeline']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/szabo01/cypress-ci-cd.git',
                        credentialsId: 'github-ssh-key'
                    ]]
                ])
            }
        }

        stage('Install & Run Cypress') {
            agent {
                docker {
                    image 'cypress/included:13.15.0'
                    args '--user 0:0 --privileged --shm-size=2g --entrypoint=""'
                }
            }
            steps {
                script {
                    echo 'Preparando ambiente...'

                    sh '''
                        rm -rf node_modules package-lock.json
                        mkdir -p /tmp/npm-cache
                        npm install --no-audit --no-fund --cache /tmp/npm-cache
                    '''

                    echo 'Rodando Cypress com Mochawesome (paralelo local)...'
                    sh '''
                        npx cypress run --parallel --group "Local Parallel Run" \
                        --reporter mochawesome \
                        --reporter-options reportDir=cypress/reports/mochawesome-report,reportFilename=mochawesome,overwrite=false,html=true,json=true \
                        --browser chrome --headless
                    '''
                }
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'cypress/reports/mochawesome-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
