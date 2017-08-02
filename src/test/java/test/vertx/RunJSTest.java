package test.vertx;

import io.vertx.core.Vertx;
import io.vertx.core.cli.CLI;
import io.vertx.core.cli.CommandLine;
import io.vertx.core.cli.annotations.CLIConfigurator;
import io.vertx.core.cli.impl.DefaultCLI;
import io.vertx.core.cli.impl.DefaultCommandLine;
import io.vertx.core.impl.launcher.VertxCommandLauncher;
import io.vertx.core.spi.launcher.ExecutionContext;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.TestSuite;
import io.vertx.ext.unit.impl.TestCommand;
import io.vertx.ext.unit.impl.TestCommandFactory;
import io.vertx.ext.unit.impl.TestContextImpl;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import io.vertx.test.core.VertxTestBase;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Created by herbert on 22/06/17.
 */
//@RunWith(VertxUnitRunner.class)
@Ignore
public class RunJSTest /*extends VertxTestBase*/ {

//    @Test
//    public void mindmapEditor(TestContext context) throws InterruptedException {
//        vertx.deployVerticle("mindmap_editor_testsuite.js", context.asyncAssertSuccess());
//
//        Thread.sleep(10000);
//    }

    private TestCommand testRunner;

    @Before
    public void setup() {
        List<String> args = Arrays.asList("js:mindmap_editor_testsuite");
        TestCommandFactory factory = new TestCommandFactory();
        CLI cli = factory.define();
//        testRunner = factory.create(cli.parse(args));
//        TestContextImpl context = new TestContextImpl(new HashMap<>(), null);
//        testRunner.setUp(context);

        testRunner = new TestCommand();
        testRunner.setReport(true);
        testRunner.setMainVerticle("js:mindmap_editor_testsuite");
        testRunner.setInstances(1);

        VertxCommandLauncher launcher = new VertxCommandLauncher();
        CommandLine evaluatedCLI = cli.parse(args);
        CLIConfigurator.inject(evaluatedCLI, testRunner);
        testRunner.setUp(new ExecutionContext(testRunner, launcher, evaluatedCLI));
    }

    @After
    public void tearDown() {
        testRunner.tearDown();
    }

    @Test
    public void mindmapEditor() throws InterruptedException {
//        vertx.deployVerticle("js:mindmap_editor_testsuite", ar -> {
//            assertTrue(ar.succeeded());
//            testComplete();
//        });
////        await();
//        final Object lock = new Object();
//        vertx.close(handler -> {
//            synchronized (lock) {
//                lock.notify();
//            }
//        });
//        synchronized (lock) {
//            lock.wait(10000);
//        }
        testRunner.run();
    }
}
