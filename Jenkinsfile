// teste
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/cypress-pipeline',
                    url: 'https://github.com/szabo01/cypress-ci-cd.git',
                    credentialsId: 'github-ssh-key'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    docker.image('cypress/included:13.15.0').inside {
                        sh '''
                            echo "Rodando testes Cypress..."
                            rm -rf node_modules package-lock.json
                            mkdir -p /tmp/npm-cache
                            npm install --no-audit --no-fund --cache /tmp/npm-cache
                            npx cypress run --browser chrome --headless
                        '''
                    }
                }
            }
        }
    }
}
