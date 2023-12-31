pipeline {
    agent any

    environment {
        MINIKUBE_IP = '192.168.59.101'
        LOCAL_REPO = '192.168.33.30'
    }

    stages {
        stage('Test') {
            steps {
                dir('backend') {
                    sh '''
                        pipenv install 
                        pipenv run pytest
                    '''
                }
            }
        }
        stage('Build Containers') {
            steps {
                script {
                        sh "docker compose -f docker-compose.yaml build"

                        sh "docker image tag taskmaster_db ${LOCAL_REPO}:5000/taskmaster_db:latest"
                        sh "docker image tag taskmaster_db ${LOCAL_REPO}:5000/taskmaster_db:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${LOCAL_REPO}:5000/taskmaster_db"

                        sh "docker image tag taskmaster_flask ${LOCAL_REPO}:5000/taskmaster_flask:latest"
                        sh "docker image tag taskmaster_flask ${LOCAL_REPO}:5000/taskmaster_flask:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${LOCAL_REPO}:5000/taskmaster_flask"

                        sh "docker image tag taskmaster_react ${LOCAL_REPO}:5000/taskmaster_react:latest"
                        sh "docker image tag taskmaster_react ${LOCAL_REPO}:5000/taskmaster_react:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${LOCAL_REPO}:5000/taskmaster_react"
                }
                // dir('docker/mysql') {
                //     script {
                //         dockerImage = docker.build( "taskmaster_db:${env.BUILD_ID}", ".")
                //         docker.withRegistry("https://${LOCAL_REPO}:5000") {
                //             container = "taskmaster_db"
                //             dockerImage.push("${env.BUILD_ID}")
                //             dockerImage.push("latest")
                //         }
                //     }
                // }
                // dir('backend') {
                //     script {
                //         dockerImage = docker.build( "taskmaster_flask:${env.BUILD_ID}", ".")
                //         docker.withRegistry("https://${LOCAL_REPO}:5000") {
                //             container = "taskmaster_flask"
                //             dockerImage.push("${env.BUILD_ID}")
                //             dockerImage.push("latest")
                //         }
                //     }
                // }
                // dir('frontend') {
                //     script {
                //         dockerImage = docker.build( "taskmaster_react:${env.BUILD_ID}", ".")
                //         docker.withRegistry("https://${LOCAL_REPO}:5000") {
                //             container = "taskmaster_react"
                //             dockerImage.push("${env.BUILD_ID}")
                //             dockerImage.push("latest")
                //         }
                //     }
                // }
            }
        }
        stage('Deploy Mysql to K8') {
            steps {
                script {
                    retry(count: 5) {
                        sh "kubectl apply -f taskmaster_deploy.yaml"
                        sleep(time: 10, unit: "SECONDS")
                    }
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