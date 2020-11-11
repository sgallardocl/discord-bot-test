pipeline {
  agente {
    docker { image 'node:12.4-alpine' }
  }

  environment {

  }

  stages {
    /* checkout repository*/
    stage('Test') {
      steps {
        sh 'node --version'
      }
    }
  }
}
