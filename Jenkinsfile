pipeline {
    agent any

    environment {
        MINIKUBE_IP = '192.168.59.101'
    }

    stages {
        stage('Build Task Master Images') {
            steps {
                dir('docker/mysql') {
                    script {
                        dockerImage = docker.build( "taskmaster_db", ".")
                    }
                }
            }
        }
        stage('Deploy to K8') {
            steps {
                script {
                    sh 'whoami'
                    sh 'pwd'
                    sh "ssh -i ~/.ssh/minikube_id_rsa docker@${MINIKUBE_IP} ls /tmp/"
                    sh "kubectl get pods -A"
                    docker.withRegistry('') {
                        dockerImage.save("taskmaster_db:latest").withTar { tar -> 
                            sh "scp -i ~/.ssh/minikube_id_rsa ${tar} docker@${MINIKUBE_IP}:/tmp/" 
                            sh "ssh -i ~/.ssh/minikube_id_rsa docker@${MINIKUBE_IP} docker load -i /tmp/${tar}"
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