const { By, until } = require('selenium-webdriver');
const { delay, QUANTMAN_URL, initializeBrowserDriver } = require('./helper');

const getFieldValue = (value, { password, pin, yearOfBirth }) => {
  let result;

  if (value.includes('M-Pin')) {
    result = pin;
  } else if(value.includes('Password')) {
    result = password;
  } else if(value.includes('Year Of Birth')) {
    result = yearOfBirth;
  }

  return result;
};

const recursivelyCheckAndFillValues = async (driver, args) => {
  const isAnyOtherFieldRequired = await driver.findElement(By.css("label.fsize12")).then(() => true).catch(() => false);

  if(isAnyOtherFieldRequired) {
    const fieldName = await driver.findElement(By.css("label.fsize12")).getText();
    const fieldValue = await getFieldValue(fieldName, args);

    console.log(`STEP 3.1: ENTER ${fieldName}: ${fieldValue}`);
    await driver.findElement(By.css('input[type=password]')).sendKeys(fieldValue);
    await driver.findElement(By.css('button.fsize14')).click();

    await delay(1000);
    await recursivelyCheckAndFillValues(driver, args);
  } 

  return;
};

const doLoginAliceBlue = async (username, password, pin, yearOfBirth) => {
  const driver = initializeBrowserDriver();

  console.log('Browser initialized');

  driver.manage().setTimeouts({ implicit: 3000, pageLoad: 300000, script: 30000 })

  await driver.get(`${QUANTMAN_URL}/auth/aliceblue`);
  console.log('Login Page opened');

  await delay(1000);

  console.log(`STEP 1: ENTER USERNAME IN BROKER PAGE`);
  await driver.findElement(By.css('input.input-field')).sendKeys(username);

  console.log(`STEP 2: CLICK NEXT TO CONTINUE`);
  await driver.findElement(By.css('button.fsize14')).click();

  console.log(`STEP 3: ENTER PIN/PASS/YOB IF ASKED`);
  await recursivelyCheckAndFillValues(driver, { username, password, pin, yearOfBirth });

  console.log(`STEP 4: CHECK RETURNED TO QUANTMAN PAGE`);
  await driver.wait(until.titleIs('Quantman'), 3000);

  await driver.quit();
};

const doLogin = async (args) => {
  const { username, password, pin, yearOfBirth } = args;

  await doLoginAliceBlue(username, password, pin, yearOfBirth)
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