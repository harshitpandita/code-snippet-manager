pipeline {
    agent any

    stages {

        stage('Pull Images') {
            steps {
                retry(3) {
                    sh 'docker pull harshitpandita/snippet-backend:latest'
                    sh 'docker pull harshitpandita/snippet-frontend:latest'
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker stop snippet-backend || true'
                sh 'docker stop snippet-frontend || true'
                sh 'docker rm snippet-backend || true'
                sh 'docker rm snippet-frontend || true'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh '''
                docker run -d \
                --restart unless-stopped \
                -p 5000:5000 \
                --name snippet-backend \
                harshitpandita/snippet-backend:latest
                '''

                sh '''
                docker run -d \
                --restart unless-stopped \
                -p 5173:5173 \
                --name snippet-frontend \
                harshitpandita/snippet-frontend:latest
                '''
            }
        }

    }
}