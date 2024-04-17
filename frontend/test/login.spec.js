const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

describe("Login test", function() {
    this.timeout(20000);
    it("should login successfully", async function() { 
        let driver = await new Builder().forBrowser('chrome').build();

        try {
            await driver.get("http://localhost:3000/");
            await driver.findElement(By.linkText('Login')).click();
            let pageURL = await driver.getCurrentUrl();
            console.log("URL_Page he:", pageURL);

            await driver.findElement(By.id('email')).sendKeys('asd@asd.asd');
            await driver.findElement(By.id('password')).sendKeys('asd');
            await driver.sleep(3000);
            await driver.findElement(By.id('button')).click();
            await driver.sleep(1000);

            // Wait for the alert to appear
            await driver.wait(until.alertIsPresent(), 2000);

            // Switch to the alert and accept it
            const alert = await driver.switchTo().alert();
            await alert.accept();
            console.log('Handled unexpected alert: "Login successfully!"');

            // Wait for the URL to change
            await driver.wait(until.urlIs('http://localhost:3000/'), 2000);

            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, 'http://localhost:3000/', 'Expected URL does not match actual URL');
        } finally {
            await driver.quit();
        }
    });
});
