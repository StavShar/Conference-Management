const { Builder, By, until, Browser } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');



describe("NavBar test", function () {
    this.timeout(100000);
    it("NavBar", async function () {

        let options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--no-sandbox'); // Needed if running as root
        options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems

        let driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();


        await driver.get('https://conference-management-frontend.onrender.com/');
        await driver.sleep(1000); // Add delay to observe page loading
        await driver.findElement(By.linkText('Register')).click();

        /////////////////////////////////////////////////////////// Login ///////////////////////////////////////////////////////////
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
        await driver.wait(until.urlIs('https://conference-management-frontend.onrender.com/'), 2000);
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        await driver.findElement(By.linkText('Create conference')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('MyConferences')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('Logout')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('Home')).click();
        await driver.sleep(1000)



        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, 'https://conference-management-frontend.onrender.com/', 'Expected URL does not match actual URL');
        await driver.quit();

    });

});