pipeline {
  agent any

  stages {
    stage('Install & Test') {
      steps {
        // Sanity-check Docker access (required for docker-compose-in-container)
        sh 'docker version'
        sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker/compose:2.17.2 version'

        // Use docker-compose (via docker image) to guarantee availability in the Jenkins agent.
        // This keeps the project demo showing docker-compose usage even if the host CLI lacks it.
        sh 'COMPOSE_CMD="docker run --rm -v $PWD:/app -v /var/run/docker.sock:/var/run/docker.sock -w /app docker/compose:latest"'

        // Start only Mongo for tests
        sh '$COMPOSE_CMD up -d mongo'
        sh 'sleep 5'

        dir('backend') {
          sh 'npm ci'
          withEnv(['MONGO_URI=mongodb://localhost:27017/snippets']) {
            sh 'npm test'
          }
        }

        // Stop services started for the tests
        sh '$COMPOSE_CMD down'
      }
    }

    stage('Build & Deploy (Docker Compose)') {
      steps {
        sh 'COMPOSE_CMD="docker run --rm -v $PWD:/app -v /var/run/docker.sock:/var/run/docker.sock -w /app docker/compose:latest"'
        sh '$COMPOSE_CMD down || true'
        sh '$COMPOSE_CMD up --build -d'
      }
    }
  }

  post {
    failure {
      echo 'Build failed. Check the console output for errors.'
    }
  }
}
