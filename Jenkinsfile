// Findora — Jenkins CI/CD pipeline
//
// What this does, stage by stage:
//   1. Checkout the repo
//   2. Install deps + lint + build the backend (TypeScript -> dist/)
//   3. Install deps + lint + build the frontend (Next.js production build)
//   4. Build Docker images for both services
//   5. (main branch only) Push images to your container registry
//   6. (main branch only) Deploy by re-running docker compose up -d
//
// SETUP — before this pipeline will run green, add these in
// Jenkins → Manage Jenkins → Credentials:
//   - "dockerhub-creds"   (Username/Password) — your registry login
//   - "findora-env"       (Secret file) — a copy of your production .env
//     (the one described in .env.example: JWT secrets, GROQ_API_KEY,
//     BREVO_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, etc.)
//
// And set these in Jenkins → this job → Configure → Parameters, or just
// edit the defaults below:
//   DOCKER_REGISTRY   e.g. "docker.io/yourusername"
//   DEPLOY_HOST       e.g. "user@your-server" (only needed for remote deploy)
//
// This file assumes a Jenkins agent with Node.js 20 and Docker available
// (install the "NodeJS" and "Docker Pipeline" plugins, and make sure the
// agent's user is in the `docker` group).

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
  }

  environment {
    DOCKER_REGISTRY = "${params.DOCKER_REGISTRY ?: 'docker.io/yourusername'}"
    BACKEND_IMAGE   = "${DOCKER_REGISTRY}/findora-backend"
    FRONTEND_IMAGE  = "${DOCKER_REGISTRY}/findora-frontend"
    IMAGE_TAG       = "${env.BUILD_NUMBER}"
  }

  parameters {
    string(name: 'DOCKER_REGISTRY', defaultValue: 'docker.io/yourusername', description: 'Container registry + namespace to push images to')
    string(name: 'DEPLOY_HOST', defaultValue: '', description: 'SSH target for deploy stage, e.g. user@1.2.3.4 (leave blank to skip remote deploy)')
    booleanParam(name: 'PUSH_IMAGES', defaultValue: false, description: 'Push built images to the registry')
    booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy via docker compose after a successful build')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Backend: install & lint') {
      steps {
        dir('findora-backend') {
          sh 'npm ci'
          // No dedicated lint script shipped yet — `tsc --noEmit` catches
          // type errors, which is the highest-value check for this stack.
          sh 'npx tsc --noEmit'
        }
      }
    }

    stage('Backend: build') {
      steps {
        dir('findora-backend') {
          sh 'npm run build'
        }
      }
    }

    stage('Frontend: install & lint') {
      steps {
        dir('findora-frontend') {
          // Using `install` rather than `ci` here since this pipeline
          // template ships with a couple of newer deps (recharts,
          // @react-google-maps/api) — run `npm install` once locally and
          // commit the refreshed package-lock.json, then switch this back
          // to `npm ci` for fully reproducible builds.
          sh 'npm install'
          sh 'npm run lint'
        }
      }
    }

    stage('Frontend: build') {
      steps {
        dir('findora-frontend') {
          // NEXT_PUBLIC_* values are baked in at build time — pull them
          // from the findora-env secret file so CI builds match production.
          withCredentials([file(credentialsId: 'findora-env', variable: 'ENV_FILE')]) {
            sh '''
              set -a
              . "$ENV_FILE"
              set +a
              npm run build
            '''
          }
        }
      }
    }

    stage('Docker: build images') {
      steps {
        dir('findora-backend') {
          sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ."
        }
        dir('findora-frontend') {
          withCredentials([file(credentialsId: 'findora-env', variable: 'ENV_FILE')]) {
            sh '''
              set -a
              . "$ENV_FILE"
              set +a
              docker build \
                --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
                --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" \
                -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest .
            '''
          }
        }
      }
    }

    stage('Docker: push images') {
      when { expression { return params.PUSH_IMAGES } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
        }
        sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
        sh "docker push ${BACKEND_IMAGE}:latest"
        sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        sh "docker push ${FRONTEND_IMAGE}:latest"
      }
    }

    stage('Deploy') {
      when { expression { return params.DEPLOY } }
      steps {
        withCredentials([file(credentialsId: 'findora-env', variable: 'ENV_FILE')]) {
          script {
            if (params.DEPLOY_HOST?.trim()) {
              // Remote deploy over SSH: copy compose file + env, pull, and
              // restart the stack on the target host.
              sh """
                scp -o StrictHostKeyChecking=no docker/docker-compose.yml ${params.DEPLOY_HOST}:~/findora-docker-compose.yml
                scp -o StrictHostKeyChecking=no "$ENV_FILE" ${params.DEPLOY_HOST}:~/findora.env
                ssh -o StrictHostKeyChecking=no ${params.DEPLOY_HOST} '\
                  docker compose -f ~/findora-docker-compose.yml --env-file ~/findora.env pull && \
                  docker compose -f ~/findora-docker-compose.yml --env-file ~/findora.env up -d \
                '
              """
            } else {
              // Local/same-host deploy — just bring the stack up here.
              sh '''
                cd docker
                cp "$ENV_FILE" ../.env
                docker compose up -d --build
              '''
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Findora build #${env.BUILD_NUMBER} succeeded — images tagged ${IMAGE_TAG}"
    }
    failure {
      echo "❌ Findora build #${env.BUILD_NUMBER} failed — check the stage logs above"
    }
    always {
      sh 'docker logout || true'
    }
  }
}
