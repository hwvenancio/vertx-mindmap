node {
    checkout scm
    def mvnHome = tool 'maven-3.5.0'
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
        sh "docker build localhost:5000/vertx-mindmap"
        sh "docker push localhost:5000/vertx-mindmap"
    }
}