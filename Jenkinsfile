pipeline {
  agent any

  stages {
    stage('Install & Test') {
      steps {
        // Sanity-check Docker access (required for docker-compose-in-container)
        sh 'docker version'

        // Choose a compose runner: prefer docker-compose/docker compose on host, else use docker/compose container.
        sh '''
          set -e

          if command -v docker-compose >/dev/null 2>&1; then
            COMPOSE_CMD="docker-compose"
          elif docker compose version >/dev/null 2>&1; then
            COMPOSE_CMD="docker compose"
          else
            COMPOSE_CMD="docker run --rm -v $PWD:/app -v /var/run/docker.sock:/var/run/docker.sock -w /app docker/compose:latest"
          fi

          echo "Using compose runner: $COMPOSE_CMD"

          # Start only Mongo for tests
          $COMPOSE_CMD up -d mongo
          sleep 5

          cd backend
          npm ci
          MONGO_URI=mongodb://localhost:27017/snippets npm test

          # Stop services started for the tests
          $COMPOSE_CMD down
        '''
      }
    }

    stage('Build & Deploy (Docker Compose)') {
      steps {
        sh '''
          set -e

          if command -v docker-compose >/dev/null 2>&1; then
            COMPOSE_CMD="docker-compose"
          elif docker compose version >/dev/null 2>&1; then
            COMPOSE_CMD="docker compose"
          else
            COMPOSE_CMD="docker run --rm -v $PWD:/app -v /var/run/docker.sock:/var/run/docker.sock -w /app docker/compose:latest"
          fi

          echo "Using compose runner: $COMPOSE_CMD"

          $COMPOSE_CMD down || true
          $COMPOSE_CMD up --build -d
        '''
      }
    }
  }

  post {
    failure {
      echo 'Build failed. Check the console output for errors.'
    }
  }
}
