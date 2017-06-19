node {
    checkout scm
    def mvnHome = tool 'maven-3.5.0'
    stage('Build') {
        echo 'Building....'
        sh "${mvnHome}/bin/mvn clean install -DskipTests"
        stash 'working-copy'
    }
    stage('Test') {
        unstash 'working-copy'
        echo 'Testing....'
        sh "${mvnHome}/bin/mvn verify"
    }
    stage('Deploy') {
        unstash 'working-copy'
        echo 'Deploying....'
        def image = docker.build "localhost:5000/vertx-mindmap"
        docker.withRegistry("http://localhost:5000") {
            image.push "localhost:5000/vertx-mindmap"
        }
    }
}