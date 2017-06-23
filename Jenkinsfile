//@Library("liferay-sdlc-jenkins-lib") import static org.liferay.sdlc.SDLCPrUtilities.*

properties([
    parameters([
        booleanParam(
            defaultValue: false
            , description: 'Runs release step'
            , name: 'RELEASE')
    ])
])

node {
    checkout scm
    def mvnHome = tool 'maven-3.5.0'
    withEnv(["M2_HOME=$mvnHome", "PATH+MAVEN=$mvnHome/bin"]) {
        try {
            stage('Build') {
                echo 'Building....'
                sh 'type -a mvn'
                sh "mvn --batch-mode -V -U clean install -DskipTests"
                stash 'working-copy'
            }
            stage('Test') {
                unstash 'working-copy'
                echo 'Testing....'
                sh "mvn --batch-mode verify"
                junit 'target/surefire-reports/*.xml'
                junit 'target/failsafe-reports/*.xml'
                stash 'working-copy'
            }
            if(BRANCH_NAME == 'master') {
                stage('Deploy-Maven') {
                    unstash 'working-copy'
                    echo 'Deploying maven artifact...'
                    sh "mvn --batch-mode deploy -DskipTests"
                }
//                stage('Deploy-Docker') {
//                    unstash 'working-copy'
//                    echo 'Deploying....'
//                    docker.withRegistry("http://localhost:5000") {
//                        def image = docker.build("vertx-mindmap:${BRANCH_NAME}")
//                        image.push("${BRANCH_NAME}")
//                    }
//                }
            }
        } catch (ex) {
//            handleError("hwvenancio/vertx-mindmap", "hwvenancio@gmail.com", "hwvenancio-github")
            closePullRequest()
            throw ex
        }
        if (params.RELEASE) {
            stage('release-dryrun') {
                unstash 'working-copy'
                echo 'Releasing...'
                sh "mvn --batch-mode release:prepare release:perform"
            }
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