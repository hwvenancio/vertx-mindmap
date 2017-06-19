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
        docker.withRegistry("http://localhost:5000") {
            def image = docker.build("vertx-mindmap:${BRANCH_NAME}")
            image.push()
        }
    }
}