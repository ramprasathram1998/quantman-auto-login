const { delay, screen, QUANTMAN_URL } = require('./helper');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const doLoginIcici = async (username, password, pin) => {
  console.log(username, password, pin);

  var driver = new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();
  console.log('Browser initialized');

  driver.manage().setTimeouts({ implicit: 3000, pageLoad: 300000, script: 30000 })

  await driver.get(`${QUANTMAN_URL}/auth/jainam_duck`);
  console.log('Login Page opened');
  await delay(500);

  console.log(`STEP 2: ENTER USER_ID AND PASS IN BROKER LOGIN PAGE`);
  // Put delay between input fields, problem due to autofocus. Need to optimize.

  await driver.findElement(By.css('input[name="login_id"]')).sendKeys(username);
  await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  
  console.log(`STEP 3: ENTER PIN`);
  await driver.findElement(By.css('input[name="answers[]"]')).sendKeys(pin);
  await driver.findElement(By.css('button[type="submit"]')).click();

  console.log(`STEP 4: CHECK RETURNED TO QUANTMAN PAGE`);
  await delay(1000);
  await driver.wait(until.titleIs('Quantman'), 3000);

  await driver.quit();
};


const doLogin = async (args) => {
  const { username, password, pin } = args;

  await doLoginIcici(username, password, pin)
    .then(() => {
      console.log('successfully completed')
    })
    .catch((e) => {
      console.log('exiting with error ', e);
    });
};

module.exports = {
  doLogin
};