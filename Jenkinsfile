pipeline {
    agent any

    environment {
        MINIKUBE_IP = sh(script: 'minikube ip', returnStdout: true).trim()
    }

    stages {
        stage('Build Task Master Images') {
            steps {
                script {
                    dockerImage = docker.build( "taskmaster_db", "-f ./docker/mysql/ .")
                }
            }
        }
        stage('Deploy to K8') {
            steps {
                script {
                    docker.withRegistry('') {
                        dockerImage.save("taskmaster_db:latest").withTar {
                            tar -> node("${MINIKUBE_IP}") {
                                sh "scp ${tar} ${MINIKUBE_IP}:/tmp/" 
                            }
                            sh "ssh ${MINIKUBE_IP} docker load -i /tmp/${tar}"
                        }
                    }
                    sh "kubectl apply -f taskmaster_db.yaml"
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