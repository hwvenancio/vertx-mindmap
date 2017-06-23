package test.vertx;

import io.vertx.core.Vertx;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Created by herbert on 22/06/17.
 */
@RunWith(VertxUnitRunner.class)
public class RunJSTest {

    private Vertx vertx;

    @Before
    public void startVertx(TestContext context) {
        vertx = Vertx.vertx();
    }

    @After
    public void stopVertx(TestContext context) {
        vertx.close(context.asyncAssertSuccess());
    }

    @Test
    public void mindmapEditor(TestContext context) {
        vertx.deployVerticle("mindmap_editor_testsuite.js", context.asyncAssertSuccess());
    }
}
