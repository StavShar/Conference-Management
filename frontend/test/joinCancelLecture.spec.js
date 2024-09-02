const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe("Join and cancel Lecture test", function () {
    this.timeout(30000);
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        let options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--no-sandbox'); // Needed if running as root
        options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
        await driver.get("https://conference-management-frontend.onrender.com/");

        // Login
        await driver.findElement(By.linkText('Login')).click();
        await driver.findElement(By.id('email')).sendKeys('test2@test.test');
        await driver.findElement(By.id('password')).sendKeys('test123');
        await driver.findElement(By.id('button')).click();
        await driver.sleep(1000);

        // Wait for the alert to appear and accept it
        await driver.wait(until.alertIsPresent(), 2000);
        const alert = await driver.switchTo().alert();
        await alert.accept();
        console.log('Handled unexpected alert: "Login successfully!"');

        // Wait for the URL to change
        await driver.wait(until.urlIs('https://conference-management-frontend.onrender.com/'), 2000);
    });

    afterEach(async function () {
        await driver.quit();
    });


    it("should Join successfully", async function () {

        const testConferenceElement = await driver.wait(until.elementLocated(By.id('TestConference')), 2000);
        await testConferenceElement.click();

        // Locate the 'lecture' element and then click on it
        const lectureElement = await driver.wait(until.elementLocated(By.id('lecture')), 2000);
        await lectureElement.click();

        const participantsElement = await driver.findElement(By.id('participants'));

        let participantsText = await participantsElement.getText();
        let initialParticipants = parseInt(participantsText.split('/')[0].split(':')[1].trim());
        await driver.sleep(2000);
        await driver.findElement(By.id('join')).click();
        await driver.sleep(2000);
        participantsText = await participantsElement.getText();
        let updatedParticipants = parseInt(participantsText.split('/')[0].split(':')[1].trim());
        console.log(updatedParticipants + initialParticipants);

        assert.equal(updatedParticipants, initialParticipants + 1, 'Expected number of participants does not match actual number of participants');



    }
    );
    it("should Cancel successfully", async function () {

        const testConferenceElement = await driver.wait(until.elementLocated(By.id('TestConference')), 2000);
        await testConferenceElement.click();

        // Locate the 'lecture' element and then click on it
        const lectureElement = await driver.wait(until.elementLocated(By.id('lecture')), 2000);
        await lectureElement.click();

        const participantsElement = await driver.findElement(By.id('participants'));
        await driver.sleep(1000);
        let participantsText = await participantsElement.getText();
        await driver.sleep(1000);
        let initialParticipants = parseInt(participantsText.split('/')[0].split(':')[1].trim());
        await driver.sleep(2000);
        await driver.findElement(By.id('cancel')).click();
        await driver.sleep(2000);
        

        participantsText = await participantsElement.getText();
        let updatedParticipants = parseInt(participantsText.split('/')[0].split(':')[1].trim());
        console.log(initialParticipants + ' adarrrrrrrrr' + updatedParticipants);
        await driver.sleep(5000);
        assert.equal(updatedParticipants, initialParticipants - 1, 'Expected number of participants does not match actual number of participants');

    });
});