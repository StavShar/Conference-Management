const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
describe("register eror test", function() {
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
    await driver.quit();
  });

  it("Email already exsit alert", async function() {
      this.timeout(10000);
      await driver.get('http://localhost:3000/');
      await driver.sleep(1000); // Add delay to observe page loading
  
    
      await driver.findElement(By.linkText('Register')).click();
  
      await driver.findElement(By.id('firstname')).sendKeys('test');
      await driver.findElement(By.id('lastname')).sendKeys('test');
      await driver.findElement(By.id('phone-number')).sendKeys('1234567890')
      await driver.findElement(By.id('email')).sendKeys('asd@asd.asd');
      await driver.findElement(By.id('password')).sendKeys('test123');
      await driver.findElement(By.id('cnfrm-password')).sendKeys('test123'); 
      const input_field = await driver.findElement(By.id("date"))
      input_field.click()
      input_field.sendKeys("2000-01-01")
      await driver.sleep(2000);
      await driver.findElement(By.id('button')).click();
      await driver.sleep(2000);

  
      const erorMsg = await driver.findElement((By.id('message')));
      const msgValue = await erorMsg.getText();
      assert.equal(msgValue, 'Email already exists', 'Expected error does not match actual error');
  });

  it("Test 2: Emtpy fileds alert", async function() {
    console.log('Test 2: Start');
    this.timeout(5000);
      await driver.get('http://localhost:3000/');
      await driver.sleep(1000); // Add delay to observe page loading

      await driver.findElement(By.linkText("Register")).click();
      const registerButton = await driver.wait(until.elementLocated(By.id('button')));
      await registerButton.click();
      await driver.sleep(1000);
  
      const erorMsg = await driver.findElement((By.id('message')));
      const msgValue = await erorMsg.getText();
      assert.equal(msgValue, "Error! fields can't be empty", 'Expected error does not match actual error');
    console.log('Test 2: End');
  });

  it("Test 3: Password does not match", async function() {
    this.timeout(7000)
    await driver.get('http://localhost:3000/');
      await driver.sleep(1000); // Add delay to observe page loading
  
       await driver.findElement(By.linkText('Register')).click();    
  
       await driver.findElement(By.id('firstname')).sendKeys('test');
       await driver.findElement(By.id('lastname')).sendKeys('test');
       await driver.findElement(By.id('phone-number')).sendKeys('1234567890')
       await driver.findElement(By.id('email')).sendKeys('test12@test.test');
       await driver.findElement(By.id('password')).sendKeys('test123');
       await driver.findElement(By.id('cnfrm-password')).sendKeys('test1234'); 
       const input_field = await driver.findElement(By.id("date"))
       input_field.click()
       input_field.sendKeys("2000-01-01")
       await driver.sleep(1000);
       await driver.findElement(By.id('button')).click();
      await driver.sleep(1000);
  
      const erorMsg = await driver.findElement((By.id('message')));
      const msgValue = await erorMsg.getText();
      assert.equal(msgValue, 'Error! passwords not match', 'Expected error does not match actual error');
  });

  it("Test 4: Email is invaild", async function() {
    this.timeout(5000)
    await driver.get('http://localhost:3000/');
      await driver.sleep(1000); // Add delay to observe page loading
  
       await driver.findElement(By.linkText('Register')).click();    
  
       await driver.findElement(By.id('firstname')).sendKeys('test');
       await driver.findElement(By.id('lastname')).sendKeys('test');
       await driver.findElement(By.id('phone-number')).sendKeys('1234567890')
       await driver.findElement(By.id('email')).sendKeys('test@test');
       await driver.findElement(By.id('password')).sendKeys('test123');
       await driver.findElement(By.id('cnfrm-password')).sendKeys('test123'); 
       const input_field = await driver.findElement(By.id("date"))
       input_field.click()
       input_field.sendKeys("2000-01-01")
       await driver.sleep(2000);
       await driver.findElement(By.id('button')).click();
      
      const erorMsg = await driver.findElement((By.id('message')));
      const msgValue = await erorMsg.getText();
      assert.equal(msgValue, 'Error! email is invalid', 'Expected error does not match actual error');
  });

});
