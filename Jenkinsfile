def customImage

pipeline {
  agent {
    // dockerfile true
    docker { image 'node:12.4-alpine' }
  }

  environment {
    HOME="."
    APP_NAME="node-discord-bot"
    REGISTRY="sgallardocl/$APP_NAME"
    CREDENTIAL_REGISTRY="DockerHub"
    TAG="latest"
    IMAGE_NAME="$REGISTRY:$TAG"
  }

  stages {
    stage("Checkout SCM") {
      when {
        anyOf {
          branch "master";
          branch "develop";
        }
      }
      steps {
        checkout scm
      }
    }

    stage("Build Configuration") {
      steps {
        script {
          if (fileExists(".env")) {
              sh "rm .env"
          }
          sh "mv .env.example .env"
        }
      }
    }

    stage("Install modules") {
      steps {
        sh "npm install"
      }
    }

    stage("Build App") {
      steps {
        sh "npm run build"
      }
    }

    stage("Build And Publish Image") {
      when {
        branch "master"
      }
      steps {
        sh "docker ps"
        //script {

          // customImage = docker.build("$IMAGE_NAME", "-f Dockerfile ./")

          // docker.withRegistry("", CREDENTIAL_REGISTRY) {
          //   customImage.push("$TAG")
          // }

          // def currentImage = docker.image("$IMAGE_NAME")
          // if (currentImage.exists()) {
          //   sh "docker image rm $IMAGE_NAME --force"
          // }

          // docker.withRegistry("", CREDENTIAL_REGISTRY) {
          //   def dockerImage = docker.build("$IMAGE_NAME")
          //   dockerImage.push()
          // }
        //}
      }
    }

    // stage("Run Image") {
    //   environment {
    //     BOT_TOKEN=crendentials("BOT_TOKEN")
    //     CONTAINER_NAME="$APP_NAME-container"
    //   }
    //   when {
    //     branch "master"
    //   }
    //   steps {
    //     //sh "docker stop $CONTAINER_NAME"
    //     //sh "docker rm -fv $CONTAINER_NAME"
    //     script {
    //       docker.image("$IMAGE_NAME").withRun("-e BOT_TOKEN=$BOT_TOKEN -d -p 8081:80 --name $CONTAINER_NAME") { c ->
    //         sh "docker ps"
    //       }
    //     }
    //   }
    // }
  }
}
