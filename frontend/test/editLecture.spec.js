const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
describe("Edit Lecture test", function () {
    this.timeout(20000);
    it("should edit successfully", async function () {
        let driver = await new Builder().forBrowser('chrome').build();

        try {

            let options = new chrome.Options();
            options.addArguments('--headless'); // Run in headless mode
            options.addArguments('--no-sandbox'); // Needed if running as root
            options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems

            await driver.get("https://conference-management-frontend.onrender.com/");

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
            await driver.wait(until.urlIs('https://conference-management-frontend.onrender.com/'), 2000);
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

            await driver.findElement(By.linkText('MyConferences')).click();
            await driver.sleep(1000);
            await driver.findElement(By.linkText('TestConference')).click();
            await driver.sleep(500);
            await driver.findElement(By.id('lecture')).click();
            await driver.sleep(500);
            await driver.findElement(By.linkText('Edit')).click();

            await driver.findElement(By.id('title')).clear();
            await driver.findElement(By.id('title')).sendKeys('NewTestLecture');

            await driver.findElement(By.id('description')).clear();
            await driver.findElement(By.id('description')).sendKeys('New Test Description');

            await driver.findElement(By.id('max-participants')).clear();
            await driver.findElement(By.id('max-participants')).sendKeys('101');

            await driver.findElement(By.id('location')).clear();
            await driver.findElement(By.id('location')).sendKeys('New Test Location');

            await driver.findElement(By.id('duration')).click();
            await driver.findElement(By.id('hours-duration')).sendKeys('2');

            await driver.findElement(By.id('lecturer-name')).clear();
            await driver.findElement(By.id('lecturer-name')).sendKeys('New Test Lecturer');

            await driver.findElement(By.id('duration')).click();
            await driver.findElement(By.id('minutes-duration')).sendKeys('45');

            await driver.findElement(By.id('lecturer-info')).clear();
            await driver.findElement(By.id('lecturer-info')).sendKeys('New Test Lecturer Info');

            await driver.executeScript("document.getElementById('date').value = '2026-02-02T00:00'");

            await driver.sleep(5000);
            await driver.findElement(By.id('button')).click();
            await driver.sleep(5000);




            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, 'https://conference-management-frontend.onrender.com/LecturePage/NewTestLecture', 'Expected URL does not match actual URL');
        } finally {
            await driver.quit();
        }
    });
});

