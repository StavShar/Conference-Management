const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
describe("Create conference test", function () {
    this.timeout(20000);
    it("should create successfully", async function () {
        let driver = await new Builder().forBrowser('chrome').build();

        try {

            let options = new chrome.Options();
            options.addArguments('--headless'); // Run in headless mode
            options.addArguments('--no-sandbox'); // Needed if running as root
            options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems

            await driver.get("http://localhost:3000/");

            /////////////////////////////////////////////////////////// Login ///////////////////////////////////////////////////////////
            await driver.findElement(By.linkText('Login')).click();

            await driver.findElement(By.id('email')).sendKeys('test1@test.test');
            await driver.findElement(By.id('password')).sendKeys('test123');
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
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


            await driver.findElement(By.linkText('Create conference')).click();
            await driver.findElement(By.id('title')).sendKeys('TestConference');
            await driver.findElement(By.id('country')).sendKeys('Test Country');
            await driver.findElement(By.id('city')).sendKeys('Test City');
            await driver.executeScript("document.getElementById('start-date').value = '2026-01-01'");
            await driver.executeScript("document.getElementById('end-date').value = '2030-01-01'");
            await driver.findElement(By.id('description')).sendKeys('Test Description');

            await driver.findElement(By.id('button')).click();
            // Wait for the alert to appear
            await driver.wait(until.alertIsPresent(), 2000);

            // Switch to the alert and accept it
            const alert1 = await driver.switchTo().alert();
            await alert1.accept();
            console.log('Handled unexpected alert: "Login successfully!"');
            await driver.sleep(1000);
            await driver.findElement(By.linkText('TestConference')).click();
            await driver.sleep(1000);

            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, 'http://localhost:3000/ConferencePage/TestConference', 'Expected URL does not match actual URL');
        } finally {
            await driver.quit();
        }
    });
});
