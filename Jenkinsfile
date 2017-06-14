node {
    checkout scm
    def mvnHome = tool 'maven-3'
    stage('Build') {
        echo 'Building....'
        sh "${mvnHome}/bin/mvn clean install -DskipTests"
        stash 'working-copy'
    }
    stage('Test') {
        echo 'Testing....'
        unstash 'working-copy'
        sh "${mvnHome}/bin/mvn verify"
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}