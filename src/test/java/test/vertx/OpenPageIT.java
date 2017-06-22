package test.vertx;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

public class OpenPageIT {

    private WebDriver driver;

    @Before
    public void setUp() {
        driver = new HtmlUnitDriver();
    }

    @After
    public void tearDown() {
        driver.quit();
    }

    @Test
    public void open() {
        Integer port = Integer.getInteger("http.port");
        driver.get("http://localhost:" + port);
        assertThat(driver.findElement(By.className("create-form"))
                , not(nullValue()));
    }
}