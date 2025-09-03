pipeline {
    agent none
    stages {
        stage('Clean Workspace on Node') {
            agent { node 'built-in' }
            steps {
                sh '''
                    echo "Searching for mochawesome.html before cleanup:"
                    find / -name mochawesome.html 2>/dev/null || echo "mochawesome.html not found"
                    echo "Listing workspaces before cleanup:"
                    ls -la /var/jenkins_home/workspace || echo "Directory /var/jenkins_home/workspace does not exist"
                    ls -la /var/jenkins_home/workspace/cypress-ci-cd || echo "Directory /var/jenkins_home/workspace/cypress-ci-cd does not exist"
                    ls -la /var/jenkins_home/workspace/cypress-ci-cd@script || echo "Directory /var/jenkins_home/workspace/cypress-ci-cd@script does not exist"
                    ls -la /var/lib/jenkins/workspace || echo "Directory /var/lib/jenkins/workspace does not exist"
                    rm -rf /var/jenkins_home/workspace/cypress-ci-cd*
                    rm -rf /var/lib/jenkins/workspace/cypress-ci-cd* 2>/dev/null || echo "Cannot remove /var/lib/jenkins/workspace/cypress-ci-cd*"
                    mkdir -p /var/jenkins_home/workspace/cypress-ci-cd
                    chmod -R 777 /var/jenkins_home/workspace
                    echo "Listing workspaces after cleanup:"
                    ls -la /var/jenkins_home/workspace/cypress-ci-cd
                    ls -la /var/lib/jenkins/workspace/cypress-ci-cd || echo "Directory /var/lib/jenkins/workspace/cypress-ci-cd does not exist"
                    echo "Searching for mochawesome.html after cleanup:"
                    find / -name mochawesome.html 2>/dev/null || echo "mochawesome.html not found"
                '''
            }
        }
        stage('Run Pipeline') {
            agent {
                docker {
                    image 'cypress/included:13.15.0'
                    args '--entrypoint="" -u 0:0 --privileged -v /tmp/.X11-unix:/tmp/.X11-unix'
                }
            }
            environment {
                NPM_CONFIG_CACHE = '/tmp/npm-cache'
                HOME = '/tmp'
                DISPLAY = ':1'
                FONTCONFIG_PATH = '/etc/fonts'
            }
            stages {
                stage('Checkout') {
                    steps {
                        sh '''
                            echo "Searching for mochawesome.html before checkout:"
                            find / -name mochawesome.html 2>/dev/null || echo "mochawesome.html not found"
                            echo "Listing workspaces before checkout:"
                            ls -la /var/jenkins_home/workspace/cypress-ci-cd || echo "Directory /var/jenkins_home/workspace/cypress-ci-cd does not exist"
                            ls -la /var/jenkins_home/workspace/cypress-ci-cd@script || echo "Directory /var/jenkins_home/workspace/cypress-ci-cd@script does not exist"
                            ls -la /var/lib/jenkins/workspace/cypress-ci-cd || echo "Directory /var/lib/jenkins/workspace/cypress-ci-cd does not exist"
                            rm -rf /var/jenkins_home/workspace/cypress-ci-cd*
                            rm -rf /var/lib/jenkins/workspace/cypress-ci-cd* 2>/dev/null || echo "Cannot remove /var/lib/jenkins/workspace/cypress-ci-cd*"
                            mkdir -p /var/jenkins_home/workspace/cypress-ci-cd
                            chmod -R 777 /var/jenkins_home/workspace
                            echo "Listing workspaces after cleanup:"
                            ls -la /var/jenkins_home/workspace/cypress-ci-cd
                            ls -la /var/lib/jenkins/workspace/cypress-ci-cd || echo "Directory /var/lib/jenkins/workspace/cypress-ci-cd does not exist"
                            echo "Searching for mochawesome.html after cleanup:"
                            find / -name mochawesome.html 2>/dev/null || echo "mochawesome.html not found"
                        '''
                        cleanWs()
                        checkout([$class: 'GitSCM', branches: [[name: '*/feature/cypress-pipeline']], userRemoteConfigs: [[url: 'https://github.com/szabo01/cypress-ci-cd.git']], extensions: [[$class: 'CleanBeforeCheckout']]])
                        sh '''
                            echo "Listing workspaces after checkout:"
                            ls -la /var/jenkins_home/workspace/cypress-ci-cd || echo "Directory /var/jenkins_home/workspace/cypress-ci-cd does not exist"
                            ls -la /var/lib/jenkins/workspace/cypress-ci-cd || echo "Directory /var/lib/jenkins/workspace/cypress-ci-cd does not exist"
                            echo "Searching for mochawesome.html after checkout:"
                            find / -name mochawesome.html 2>/dev/null || echo "mochawesome.html not found"
                        '''
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
                        sh 'chmod -R 777 cypress/reports/mochawesome-report'
                    }
                }
                stage('Archive Reports') {
                    steps {
                        archiveArtifacts artifacts: 'cypress/reports/mochawesome-report/*.html', allowEmptyArchive: true
                    }
                }
            }
        }
    }
    post {
        always {
            node('built-in') {
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