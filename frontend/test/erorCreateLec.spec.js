const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe("Create Lecture test", function() {
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
        await driver.findElement(By.linkText('MyConferences')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('TestConference')).click();
        await driver.findElement(By.linkText('+ Lecture')).click();
        await driver.findElement(By.id('button')).click();

        const errorMessage = await driver.findElement(By.id('message')).getText();
        assert.equal(errorMessage, "Error! fields can't be empty", 'Expected error message does not match actual message');
    });

    it("should show error for invalid participant range", async function() {
        await driver.findElement(By.linkText('MyConferences')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('TestConference')).click();
        await driver.findElement(By.linkText('+ Lecture')).click();
        await driver.findElement(By.id('title')).sendKeys('TestLecture');
        await driver.findElement(By.id('description')).sendKeys('Test Description');
        await driver.findElement(By.id('max-participants')).sendKeys('5'); // Less than 10 participants
        await driver.findElement(By.id('location')).sendKeys('Test Location');
        await driver.findElement(By.id('duration')).click();
        await driver.findElement(By.id('hours-duration')).sendKeys('1'); 
        await driver.findElement(By.id('lecturer-name')).sendKeys('Test Lecturer');
        await driver.findElement(By.id('duration')).click();
        await driver.findElement(By.id('minutes-duration')).sendKeys('30');
        await driver.findElement(By.id('lecturer-info')).sendKeys('Test Lecturer Info');
        await driver.executeScript("document.getElementById('date').value = '2026-02-01'");
        await driver.findElement(By.id('form')).click();
        await driver.findElement(By.id('question')).sendKeys('test');
        await driver.findElement(By.id('answer-0')).sendKeys('test');
        await driver.findElement(By.id('answer-1')).sendKeys('test');
        await driver.findElement(By.id('button')).click();
        const errorMessage = await driver.findElement(By.id('message')).getText();
        assert.equal(errorMessage, 'Error! max participants must be between 10 to 200', 'Expected error message does not match actual message');
    });

    it("should show error for invalid duration time", async function() {
        await driver.findElement(By.linkText('MyConferences')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('TestConference')).click();
        await driver.findElement(By.linkText('+ Lecture')).click();
        await driver.findElement(By.id('title')).sendKeys('TestLecture');
        await driver.findElement(By.id('description')).sendKeys('Test Description');
        await driver.findElement(By.id('max-participants')).sendKeys('100');
        await driver.findElement(By.id('location')).sendKeys('Test Location');
        await driver.findElement(By.id('duration')).click();
        await driver.findElement(By.id('hours-duration')).sendKeys('0'); 
        await driver.findElement(By.id('lecturer-name')).sendKeys('Test Lecturer');
        await driver.findElement(By.id('duration')).click();
        await driver.findElement(By.id('minutes-duration')).sendKeys('20');
        await driver.findElement(By.id('lecturer-info')).sendKeys('Test Lecturer Info');
        await driver.executeScript("document.getElementById('date').value = '2026-03-01'");
        await driver.findElement(By.id('form')).click();
        await driver.findElement(By.id('question')).sendKeys('test');
        await driver.findElement(By.id('answer-0')).sendKeys('test');
        await driver.findElement(By.id('answer-1')).sendKeys('test');
        await driver.findElement(By.id('button')).click();

        const errorMessage = await driver.findElement(By.id('message')).getText();
        assert.equal(errorMessage, 'Error! duration time must be between 30 min to 300 min', 'Expected error message does not match actual message');
    });

    it("should show error for lecture date less than 24 hours from now", async function() {
        await driver.findElement(By.linkText('MyConferences')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('TestConference')).click();
        await driver.findElement(By.linkText('+ Lecture')).click();
        await driver.findElement(By.id('title')).sendKeys('TestLecture');
        await driver.findElement(By.id('description')).sendKeys('Test Description');
        await driver.findElement(By.id('max-participants')).sendKeys('100');
        await driver.findElement(By.id('location')).sendKeys('Test Location');
        await driver.findElement(By.id('duration')).click();
        await driver.findElement(By.id('hours-duration')).sendKeys('1'); 
        await driver.findElement(By.id('lecturer-name')).sendKeys('Test Lecturer');
        await driver.findElement(By.id('duration')).click();
        await driver.findElement(By.id('minutes-duration')).sendKeys('30');
        await driver.findElement(By.id('lecturer-info')).sendKeys('Test Lecturer Info');
        const now = new Date();
        const lessThan24Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now
        const lessThan24HoursStr = lessThan24Hours.toISOString().split('T')[0];
        await driver.executeScript(`document.getElementById('date').value = '${lessThan24HoursStr}'`);
        await driver.findElement(By.id('button')).click();
        await driver.sleep(3000);

        const errorMessage = await driver.findElement(By.id('message')).getText();
        assert.equal(errorMessage, 'Error! the lecture should start at least 24 hours from now', 'Expected error message does not match actual message');
    });

});
