const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
describe("Login test", function () {
    this.timeout(20000);
    it("should login successfully", async function () {
        let driver = await new Builder().forBrowser('chrome').build();

        try {

            let options = new chrome.Options();
            options.addArguments('--headless'); // Run in headless mode
            options.addArguments('--no-sandbox'); // Needed if running as root
            options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems

            await driver.get("https://conference-management-frontend.onrender.com/");
            await driver.findElement(By.linkText('Login')).click();
            let pageURL = await driver.getCurrentUrl();
            console.log("URL_Page he:", pageURL);

            await driver.findElement(By.id('email')).sendKeys('asd@asd.asd');
            await driver.findElement(By.id('password')).sendKeys('asd');
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

            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, 'https://conference-management-frontend.onrender.com/', 'Expected URL does not match actual URL');
        } finally {
            await driver.quit();
        }
    });
});
