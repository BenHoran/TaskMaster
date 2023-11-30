pipeline {
    agent any

    environment {
        MINIKUBE_IP = '192.168.59.101'
        LOCAL_REPO = '192.168.33.30'
    }

    stages {
        stage('Flask Unit Tests') {
            steps {
                dir('backend') {
                    sh '''
                        pip install pipenv
                        pipenv install --system --deploy
                        pytest
                    '''
                }
            }
        }
        stage('Build Mysql Container') {
            steps {
                dir('docker/mysql') {
                    script {
                        dockerImage = docker.build( "taskmaster_db:${env.BUILD_ID}", ".")
                    }
                }
            }
        }
        stage('Build Flask Container') {
            steps {
                dir('backend') {
                    script {
                        dockerImage = docker.build( "taskmaster_flask:${env.BUILD_ID}", ".")
                    }
                }
            }
        }
        stage('Deploy Mysql to K8') {
            steps {
                script {
                    docker.withRegistry("https://${LOCAL_REPO}:5000") {
                        container = "taskmaster_db"
                        dockerImage.push("${env.BUILD_ID}")
                        dockerImage.push("latest")
                    }
                    sh "kubectl apply -f taskmaster_db.yaml"
                }
            }
        }
        stage('Deploy Flask to K8') {
            steps {
                script {
                    docker.withRegistry("https://${LOCAL_REPO}:5000") {
                        container = "taskmaster_flask"
                        dockerImage.push("${env.BUILD_ID}")
                        dockerImage.push("latest")
                    }
                    sh "kubectl apply -f taskmaster_flask.yaml"
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment successful.'
        }
        failure {
            echo 'Build or deployment failed. Please check logs for details'
        }
    }
}