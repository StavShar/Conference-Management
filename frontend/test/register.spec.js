const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');
const backendURL = 'https://conference-management.onrender.com';


describe("register test", function () {
    this.timeout(20000); // Increase timeout to allow for the delete request
    let driver;

    // Hook to setup WebDriver instance before tests
    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--no-sandbox'); // Needed if running as root
        options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems


        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });



    it("register test", function () { // No need for async function declaration
        return new Promise(async (resolve, reject) => { // Return a Promise
            try {
                // First, send a request to delete the user if they exist
                const userEmail = 'test123@test.test';
                const res = await axios.delete(backendURL + "/auth/deleteUser", { data: { email: userEmail } });
                console.log(res.data.message);

                await driver.get('http://localhost:3000/');

                const registerLink = await driver.wait(until.elementLocated(By.linkText('Register')));
                await registerLink.click();

                await driver.findElement(By.id('firstname')).sendKeys('test');
                await driver.findElement(By.id('lastname')).sendKeys('test');
                await driver.findElement(By.id('phone-number')).sendKeys('0521111114');
                await driver.findElement(By.id('email')).sendKeys(userEmail);
                await driver.findElement(By.id('password')).sendKeys('test123');
                await driver.findElement(By.id('cnfrm-password')).sendKeys('test123');
                const input_field = await driver.findElement(By.id("date"));
                input_field.click();
                input_field.sendKeys("2000-01-01");
                await driver.sleep(2000);
                await driver.findElement(By.id('button')).click();

                // Wait for the alert to appear
                await driver.wait(until.alertIsPresent());

                // Switch to the alert and accept it
                const alert = await driver.switchTo().alert();
                await alert.accept();

                const currentUrl = await driver.getCurrentUrl();
                assert.equal(currentUrl, 'http://localhost:3000/login', 'Expected URL does not match actual URL');

                resolve(); // Resolve the Promise to indicate the test is complete
            } catch (error) {
                reject(error); // Reject the Promise with the error
            } finally {
                if (driver) {
                    await driver.quit();
                }
            }
        });
    });
});
