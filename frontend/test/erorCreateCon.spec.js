const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe("Create conference error test", function() {
    this.timeout(30000);

    let driver;
    beforeEach(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        let options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--no-sandbox'); // Needed if running as root
        options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
        await driver.get("http://localhost:3000/");

        // Login
        await driver.findElement(By.linkText('Login')).click();
        await driver.findElement(By.id('email')).sendKeys('test1@test.test');
        await driver.findElement(By.id('password')).sendKeys('test123');
        await driver.findElement(By.id('button')).click();
        await driver.sleep(1000);

        // Wait for the alert to appear and accept it
        await driver.wait(until.alertIsPresent(), 2000);
        const alert = await driver.switchTo().alert();
        await alert.accept();
        console.log('Handled unexpected alert: "Login successfully!"');

        // Wait for the URL to change
        await driver.wait(until.urlIs('http://localhost:3000/'), 2000);
    });

    afterEach(async function() {
        await driver.quit();
    });

    it("should show error for empty fields", async function() {
        await driver.findElement(By.linkText('Create conference')).click();
        await driver.findElement(By.id('button')).click();
        
        const element = await driver.wait(until.elementLocated(By.id('message')), 2000);
        const errorMessage = await element.getText();
      
        await driver.wait(until.alertIsPresent(), 2000);
        
        assert.equal(errorMessage, "Error! fields can't be empty", 'Expected error message does not match actual message');
    });

    it("should show error for incorrect start date", async function() {
        await driver.findElement(By.linkText('Create conference')).click();
        await driver.findElement(By.id('title')).sendKeys('TestConference');
        await driver.findElement(By.id('country')).sendKeys('Test Country');
        await driver.findElement(By.id('city')).sendKeys('Test City');
        await driver.executeScript("document.getElementById('start-date').value = '2020-01-01'"); // Incorrect past date
        await driver.executeScript("document.getElementById('end-date').value = '2030-01-01'");
        await driver.findElement(By.id('description')).sendKeys('Test Description');

        await driver.findElement(By.id('button')).click();
       

        const errorMessage = await driver.findElement(By.id('message')).getText();
        assert.equal(errorMessage, 'Error! dates are invalid', 'Expected error message does not match actual message');
    });

    it("should show error for incorrect end date", async function() {
        await driver.findElement(By.linkText('Create conference')).click();
        await driver.findElement(By.id('title')).sendKeys('TestConference');
        await driver.findElement(By.id('country')).sendKeys('Test Country');
        await driver.findElement(By.id('city')).sendKeys('Test City');
        await driver.executeScript("document.getElementById('start-date').value = '2026-01-01'");
        await driver.executeScript("document.getElementById('end-date').value = '2025-01-01'"); // Incorrect end date
        await driver.findElement(By.id('description')).sendKeys('Test Description');

        await driver.findElement(By.id('button')).click();

        const errorMessage = await driver.findElement(By.id('message')).getText();
        assert.equal(errorMessage, 'Error! dates are invalid', 'Expected error message does not match actual message');
    });
});
