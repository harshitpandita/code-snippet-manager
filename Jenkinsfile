pipeline {
  agent any

  stages {
    stage('Install & Test') {
      steps {
        // Bring up Mongo (used by tests) via docker-compose so we don't rely on mongodb-memory-server binaries
        sh 'docker-compose up -d mongo'
        // Wait briefly for Mongo to become available
        sh 'sleep 5'

        dir('backend') {
          sh 'npm ci'
          withEnv(['MONGO_URI=mongodb://localhost:27017/snippets']) {
            sh 'npm test'
          }
        }

        // Stop services started for the tests
        sh 'docker-compose down'
      }
    }

    stage('Build & Deploy (Docker Compose)') {
      steps {
        sh 'docker-compose down || true'
        sh 'docker-compose up --build -d'
      }
    }
  }

  post {
    failure {
      echo 'Build failed. Check the console output for errors.'
    }
  }
}
