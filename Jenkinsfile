pipeline {
  agent any

  stages {
    stage('Debug Workspace') {
      steps {
        sh '''
          pwd
          ls -la
          test -f docker-compose.yml
        '''
      }
    }

    stage('Install & Test') {
      steps {
        sh 'docker version'
        sh 'docker compose version'

        sh '''
          set -e

          docker compose down --remove-orphans || true
          docker compose up -d mongo
          sleep 10

          cd backend
          npm ci
          MONGO_URI=mongodb://host.docker.internal:27017/snippets npm test

          cd ..
          docker compose down --remove-orphans
        '''
      }
    }

    stage('Build & Deploy (Docker Compose)') {
      steps {
        sh '''
          set -e
          docker compose down --remove-orphans || true
          docker compose up --build -d
        '''
      }
    }
  }

  post {
    always {
      sh 'docker compose down --remove-orphans || true'
    }
    failure {
      echo 'Build failed. Check the console output for errors.'
    }
  }
}