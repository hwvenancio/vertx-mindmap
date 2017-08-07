
properties([
    parameters([
        booleanParam(
            defaultValue: false
            , description: 'Runs release step'
            , name: 'RELEASE')
    ])
])

node {
    deleteDir()
    checkout scm
    def mvnHome = tool 'maven-3.5.0'
    withEnv(["M2_HOME=$mvnHome", "PATH+MAVEN=$mvnHome/bin"]) {
        try {
            stage('Build') {
                def project = readMavenPom file: ''
                echo "Building ${project.artifactId} - ${project.version} ..."
                sh 'command -V mvn'
                sh 'mvn --batch-mode -V -U clean install -DskipTests -DskipITs'
            }
            stage('Test') {
                echo 'Testing....'
                try {
                    wrap([$class: 'Xvnc']) {
                        sh 'mvn --batch-mode verify'
                    }
                } finally {
                    junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: true
                    junit testResults: 'target/failsafe-reports/*.xml', allowEmptyResults: true
                }
            }
            stage('Test-Release') {
                echo 'Release Dry Run....'
                sh 'mvn --batch-mode release:prepare -DdryRun=true -Darguments="-DskipTests -DskipITs"'
                sh 'mvn --batch-mode release:clean'
            }
            if(BRANCH_NAME == 'master') {
                milestone()
                stage('Deploy-Maven') {
                    echo 'Deploying maven artifact...'
                    sh "mvn --batch-mode deploy -DskipTests -DskipITs"
                }
                milestone()
                lock(resource: 'docker') {
                    stage(name: 'Deploy-Docker') {
                        echo 'Deploying....'
                        docker.withRegistry("http://localhost:5000") {
                            def image = docker.build("vertx-mindmap:${env.BRANCH_NAME}")
                            image.push("${env.BRANCH_NAME}")
                        }
                    }
                }
            }
        } catch (ex) {
            closePullRequest()
            throw ex
        }
        if (params.RELEASE) {
            stage('Release') {
                echo 'Releasing...'
                sh 'git checkout master'
                def project = readMavenPom file: ''
                echo "before ${project.version}"
                sh 'mvn --batch-mode -Dresume=false release:prepare release:perform -Darguments="-DskipTests -DskipITs"'
                def after = readMavenPom file: ''
                echo "after ${after.version}"
                createPostBuildBranch(project)
            }
        }
    }
}

def closePullRequest() {
    if(env.CHANGE_ID != null) {
        def patchBody = """ {"state": "closed"} """
        httpRequest(
                acceptType: 'APPLICATION_JSON'
                , contentType: 'APPLICATION_JSON'
                , authentication: 'hwvenancio-github'
                , httpMode: 'PATCH'
                , requestBody: patchBody
                , url: "https://api.github.com/repos/hwvenancio/vertx-mindmap/pulls/${env.CHANGE_ID}")
    }
}

def createPostBuildBranch(project) {
    def tagVersion = project.version.replace('-SNAPSHOT', '')
    def devVersion = project.version.replace('-SNAPSHOT', '.1-SNAPSHOT')
    def tagName = "${project.artifactId}-${tagVersion}"
    def branch = tagVersion + ".X"
    sh "mvn -Dtag=$tagName -DdevelopmentVersion=$devVersion -DbranchName=$branch -DreleaseVersion=$devVersion -DupdateBranchVersions=true release:branch"
}