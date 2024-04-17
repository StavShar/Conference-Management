const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

describe("Login Eror test", function() {
    let driver 
     // Hook to setup WebDriver instance before tests
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  // Hook to close WebDriver instance after tests
  afterEach(async function() {
    await driver.quit();
  });

    it("Empty fileds", async function() { 
        this.timeout(5000);
            await driver.get("http://localhost:3000/");
            await driver.findElement(By.linkText('Login')).click();
            
            await driver.findElement(By.id('button')).click();
            await driver.sleep(1000);

            const erorMsg = await driver.findElement((By.id('message')));
            const msgValue = await erorMsg.getText();
            
            assert.equal(msgValue, "Error! fields can't be empty", 'Expected Eror does not match actual Eror');
    });
    it("Email not vaild",async function(){
        this.timeout(3000);
            await driver.get("http://localhost:3000/");
            await driver.findElement(By.linkText('Login')).click();

            await driver.findElement(By.id('email')).sendKeys('test@.test');
            await driver.findElement(By.id('password')).sendKeys('asd');
            await driver.findElement(By.id('button')).click();
            await driver.sleep(1000);

            const erorMsg = await driver.findElement((By.id('message')));
            const msgValue = await erorMsg.getText();
            
            assert.equal(msgValue, "Error! email is invalid", 'Expected Eror does not match actual Eror');
    })
    it("Email not exists",async function(){
        this.timeout(3000);
            await driver.get("http://localhost:3000/");
            await driver.findElement(By.linkText('Login')).click();

            await driver.findElement(By.id('email')).sendKeys('a@gmail.com');
            await driver.findElement(By.id('password')).sendKeys('asd');
            await driver.findElement(By.id('button')).click();
            await driver.sleep(1000);

            const erorMsg = await driver.findElement((By.id('message')));
            const msgValue = await erorMsg.getText();
            
            assert.equal(msgValue, "Email does not exists", 'Expected Eror does not match actual Eror');
    })
    it("Password not correct",async function(){
        this.timeout(3000);
            await driver.get("http://localhost:3000/");
            await driver.findElement(By.linkText('Login')).click();

            await driver.findElement(By.id('email')).sendKeys('asd@asd.asd');
            await driver.findElement(By.id('password')).sendKeys('asd123');
            await driver.findElement(By.id('button')).click();
            await driver.sleep(1000);
            
            const erorMsg = await driver.findElement((By.id('message')));
            const msgValue = await erorMsg.getText();

            assert.equal(msgValue, "Password is incorrect", 'Expected Eror does not match actual Eror');
    })
});
