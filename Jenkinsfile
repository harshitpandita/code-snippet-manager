pipeline {
  agent any

  stages {

    stage('Verify Environment') {
      steps {
        sh '''
        docker version
        docker compose version
        pwd
        ls -la
        '''
      }
    }

    stage('Install & Test') {
      steps {
        sh '''
        set -e

        docker compose up -d mongo
        sleep 5

        cd backend
        npm ci
        MONGO_URI=mongodb://localhost:27017/snippets npm test

        cd ..
        docker compose down
        '''
      }
    }

    stage('Build & Deploy') {
      steps {
        sh '''
        set -e
        docker compose up --build -d
        '''
      }
    }

  }

  post {
    always {
      sh 'docker compose down || true'
    }
    failure {
      echo 'Build failed. Check logs.'
    }
  }
}