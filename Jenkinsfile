pipeline {
    agent any

    environment {
        MINIKUBE_IP = '192.168.59.101'
        // DOCKER_REPO = '192.168.33.30:5000'
        DOCKER_REPO = 'ghcr.io'
        DOCKER_GITHUB = credentials('GITHUB_DOCKER')
        NAMESPACE = 'tm'
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
                        sh "echo ${env.DOCKER_GITHUB} | docker login ${DOCKER_REPO} -u ${env.GITHUB_USER} --password-stdin"

                        sh "docker image tag taskmaster_db ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_db:latest"
                        // sh "docker image tag taskmaster_db ${DOCKER_REPO}:5000/taskmaster_db:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_db"

                        sh "docker image tag taskmaster_flask ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_flask:latest"
                        // sh "docker image tag taskmaster_flask ${DOCKER_REPO}:5000/taskmaster_flask:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_flask"

                        sh "docker image tag taskmaster_react ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_react:latest"
                        // sh "docker image tag taskmaster_react ${DOCKER_REPO}:5000/taskmaster_react:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${DOCKER_REPO}/${env.NAMESPACE}/{env.GITHUB_OWNER}/taskmaster_react"

                        sh "docker image tag taskmaster_web ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_web:latest"
                        // sh "docker image tag taskmaster_react ${DOCKER_REPO}:5000/taskmaster_react:${env.BUILD_ID}"
                        sh "docker image push --all-tags ${DOCKER_REPO}/${env.NAMESPACE}/taskmaster_web"
                }
                // dir('docker/mysql') {
                //     script {
                //         dockerImage = docker.build( "taskmaster_db:${env.BUILD_ID}", ".")
                //         docker.withRegistry("https://${DOCKER_REPO}:5000") {
                //             container = "taskmaster_db"
                //             dockerImage.push("${env.BUILD_ID}")
                //             dockerImage.push("latest")
                //         }
                //     }
                // }
                // dir('backend') {
                //     script {
                //         dockerImage = docker.build( "taskmaster_flask:${env.BUILD_ID}", ".")
                //         docker.withRegistry("https://${DOCKER_REPO}:5000") {
                //             container = "taskmaster_flask"
                //             dockerImage.push("${env.BUILD_ID}")
                //             dockerImage.push("latest")
                //         }
                //     }
                // }
                // dir('frontend') {
                //     script {
                //         dockerImage = docker.build( "taskmaster_react:${env.BUILD_ID}", ".")
                //         docker.withRegistry("https://${DOCKER_REPO}:5000") {
                //             container = "taskmaster_react"
                //             dockerImage.push("${env.BUILD_ID}")
                //             dockerImage.push("latest")
                //         }
                //     }
                // }
            }
        }
        // stage ('Start Docker') {
        //     steps {
        //         script {
        //                 sh "docker compose -f docker-compose.yaml up -d"
        //         }
        //     }
        // }

        // stage('Deploy Mysql to K8') {
        //     steps {
        //         script {
        //             retry(count: 5) {
        //                 sh "kubectl apply -f taskmaster_deploy.yaml"
        //                 sleep(time: 10, unit: "SECONDS")
        //             }
        //         }
        //     }
        // }
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