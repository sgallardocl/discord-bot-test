pipeline {
  agent {
    docker { image 'node:12.4-alpine' }
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
