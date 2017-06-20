node {
    checkout scm
    withEnv(["PATH+MAVEN=${tool 'maven-3.5.0'}/bin"]) {
        try {
            stage('Build') {
                echo 'Building....'
                sh "mvn --batch-mode -V -U clean install -DskipTests"
                stash 'working-copy'
            }
            stage('Test') {
                unstash 'working-copy'
                echo 'Testing....'
                sh "mvn --batch-mode -V -U verify"
            }
            stage('Deploy') {
                unstash 'working-copy'
                echo 'Deploying....'
                docker.withRegistry("http://localhost:5000") {
                    def image = docker.build("vertx-mindmap:${BRANCH_NAME}")
                    image.push()
                }
            }
        } catch (ex) {
            closePullRequest()
            throw ex
        }
    }
}

def closePullRequest() {
    if(CHANGE_ID != null) {
        def patchBody = """ {"state": "closed"} """
        httpRequest(
                acceptType: 'APPLICATION_JSON'
                , contentType: 'APPLICATION_JSON'
                , authentication: 'hwvenancio-github'
                , httpMode: 'PATCH'
                , requestBody: patchBody
                , url: "https://api.github.com/repos/hwvenancio/vertx-mindmap/pulls/${CHANGE_ID}")
    }
}