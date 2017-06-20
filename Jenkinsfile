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
            if(CHANGE_ID != null) {
                def patchBody = """ {"state": "closed"} """
                def response = httpRequest(
                        acceptType: 'APPLICATION_JSON'
                        , contentType: 'APPLICATION_JSON'
                        , httpMode: 'PATCH'
                        , requestBody: patchBody
                        , url: "https://api.github.com/orgs/${orgName}")
            }
            throw ex
        }
    }
}