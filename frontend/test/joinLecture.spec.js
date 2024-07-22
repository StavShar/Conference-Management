const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
describe("Join Lecture test", function() {
    this.timeout(20000);
    it("should Join successfully", async function() { 
        let driver = await new Builder().forBrowser('chrome').build();

        try {

            let options = new chrome.Options();
            options.addArguments('--headless'); // Run in headless mode
            options.addArguments('--no-sandbox'); // Needed if running as root
            options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems

            await driver.get("http://localhost:3000/");

            /////////////////////////////////////////////////////////// Login ///////////////////////////////////////////////////////////
            await driver.findElement(By.linkText('Login')).click();

            await driver.findElement(By.id('email')).sendKeys('test2@test.test');
            await driver.findElement(By.id('password')).sendKeys('test123');
            await driver.findElement(By.id('button')).click();
            await driver.sleep(1000);

            // Wait for the alert to appear
            await driver.wait(until.alertIsPresent(), 2000);

            // Switch to the alert and accept it
            const alert = await driver.switchTo().alert();
            await alert.accept();
            console.log('Handled unexpected alert: "Login successfully!"');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Wait for the URL to change
            await driver.wait(until.urlIs('http://localhost:3000/'), 2000);
            // Locate the 'TestConference' element and then click on it

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
            console.log(updatedParticipants + "adar" + initialParticipants);
           
            assert.equal(updatedParticipants, initialParticipants + 1, 'Expected number of participants does not match actual number of participants');



        } finally {
            await driver.quit();
        }   });
} );