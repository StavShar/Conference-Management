const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe("register test", function() {
    this.timeout(10000);
    let driver;

    // Hook to setup WebDriver instance before tests
    beforeEach(async function() {
        let options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--no-sandbox'); // Needed if running as root
        options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    // Hook to close WebDriver instance after tests
    afterEach(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it("register test", function() { // No need for async function declaration
        return new Promise(async (resolve, reject) => { // Return a Promise
            let driver;
            try {
                
                driver = await new Builder().forBrowser('chrome').build();

                await driver.get('http://localhost:3000/');


                
                const registerLink = await driver.wait(until.elementLocated(By.linkText('Register')));
                await registerLink.click();

                
                await driver.findElement(By.id('firstname')).sendKeys('test');
                await driver.findElement(By.id('lastname')).sendKeys('test');
                await driver.findElement(By.id('phone-number')).sendKeys('1234567891')
                await driver.findElement(By.id('email')).sendKeys('test123@test.test');
                await driver.findElement(By.id('password')).sendKeys('test123');
                await driver.findElement(By.id('cnfrm-password')).sendKeys('test123'); 
                const input_field = await driver.findElement(By.id("date"))
                input_field.click()
                input_field.sendKeys("2000-01-01")
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
