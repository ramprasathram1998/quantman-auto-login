const { By, until } = require('selenium-webdriver');
const { delay, QUANTMAN_SIGN_IN_URL, initializeBrowserDriver } = require('./helper');

const doLoginIcici = async (username, password, pin) => {
  const driver = initializeBrowserDriver();

  console.log('Browser initialized');

  driver.manage().setTimeouts({ implicit: 3000, pageLoad: 300000, script: 30000 })

  await driver.get(QUANTMAN_SIGN_IN_URL);
  console.log('Login Page opened');
  await delay(500);

  console.log(`STEP 1: ENTER FLATTRADE USER ID IN QUANTMAN MODAL AND CLICK LOGIN`);
  await driver.findElement(By.id("flattrade-user-auth")).click();
  await driver.findElement(By.id("flattrade-client-id")).sendKeys(username);
  await driver.findElement(By.id("btn-flattrade")).click();

  console.log(`STEP 2: ENTER FLATTRADE CREDS IN BROKER LOGIN PAGE`);
  // Put delay between input fields, problem due to autofocus. Need to optimize.
  await delay(2000);
  await driver.findElement(By.css("input#input-17")).sendKeys(username);
  await delay(1000); 
  await driver.findElement(By.css("input#pwd")).sendKeys(password);
  await delay(1000);
  await driver.findElement(By.css("input#pan")).sendKeys(pin);

  console.log(`STEP 3: CLICK LOGIN TO CONTINUE`);
  await delay(1000);
  await driver.findElement(By.css('button#sbmt')).click();

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