package test.vertx;

import io.vertx.core.Vertx;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Created by herbert on 22/06/17.
 */
@RunWith(VertxUnitRunner.class)
@Ignore
public class MindmapEditorTest {

    private static final String MINDMAP_EDITOR_ID = "mindmap_editor-ID";

    private Vertx vertx;

    @Before
    public void deploy(final TestContext context) throws InterruptedException {
        vertx = Vertx.vertx();

        Async async = context.async();
        vertx.deployVerticle("js:mindmap_editor_testsuite", result -> {
            if(result.failed()) {
                System.out.println("failed to deploy");
                context.fail("Deployment failed");
            } else {
                String res = result.result();
                System.out.println("deployed " + res);
                context.put(MINDMAP_EDITOR_ID, res);
                async.complete();
            }
        });
    }

    @After
    public void tearDown(final TestContext context) {
        String verticleId = context.get(MINDMAP_EDITOR_ID);
        System.out.println("undeploying " + verticleId);
        vertx.undeploy(verticleId);
    }

    @Test
    public void mindmapEditor(final TestContext context) {
        String s = "value";
        context.assertEquals("value", s);
    }
}
