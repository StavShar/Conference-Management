const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
describe("Create Lecture test", function() {
    this.timeout(20000);
    it("should create successfully", async function() { 
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
            await driver.executeScript("document.getElementById('date').value = '2026-02-01'");
            await driver.findElement(By.id('form')).click();
            await driver.findElement(By.id('question')).sendKeys('test');
            await driver.findElement(By.id('answer-0')).sendKeys('test');
            await driver.findElement(By.id('answer-1')).sendKeys('test');


           
            await driver.sleep(2000);
            await driver.findElement(By.id('button')).click();
            await driver.sleep(2000);
              // Wait for the alert to appear
              await driver.wait(until.alertIsPresent(), 2000);

              // Switch to the alert and accept it
              const alert1 = await driver.switchTo().alert();
              await alert1.accept();
              console.log('Handled unexpected alert: "Create successfully!"');
              
            await driver.sleep(1000);
            await driver.findElement(By.linkText('TestConference')).click();
            await driver.sleep(1000);
            await driver.findElement(By.id('lecture')).click();

            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, 'http://localhost:3000/LecturePage/TestLecture', 'Expected URL does not match actual URL');
        } finally {
            await driver.quit();
        }
    });
});

