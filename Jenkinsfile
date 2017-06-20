node {
    checkout scm
    withEnv(["PATH+MAVEN=${tool 'maven-3.5.0'}/bin"]) {
        stage('Build') {
            echo 'Building....'
            sh "mvn --batch-mode -V -U clean install -DskipTests"
            stash 'working-copy'
        }
        stage('Test') {
            unstash 'working-copy'
            echo 'Testing....'
            sh "mvn verify"
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
}