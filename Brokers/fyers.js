const { By, until, Key } = require('selenium-webdriver');
const {
  delay,
  QUANTMAN_URL,
  fetchTOTP,
  initializeBrowserDriver
} = require('./helper');

const emptyTOTPContainers = async (driver) => {
  const otpContainerElement = By.id('otp-container');

  await driver.findElement(otpContainerElement).findElement(By.id('first')).sendKeys(Key.BACK_SPACE);
  await driver.findElement(otpContainerElement).findElement(By.id('second')).sendKeys(Key.BACK_SPACE);
  await driver.findElement(otpContainerElement).findElement(By.id('third')).sendKeys(Key.BACK_SPACE);
  await driver.findElement(otpContainerElement).findElement(By.id('fourth')).sendKeys(Key.BACK_SPACE);
  await driver.findElement(otpContainerElement).findElement(By.id('fifth')).sendKeys(Key.BACK_SPACE);
  await driver.findElement(otpContainerElement).findElement(By.id('sixth')).sendKeys(Key.BACK_SPACE);
};

const enterTOTP = async (driver, totpSecretKey, isReAttempt) => {
  const TOTP = await fetchTOTP('FYERS', totpSecretKey);
  const otpContainerElement = By.id('otp-container');

  if (isReAttempt) { await emptyTOTPContainers(driver) };

  await driver.findElement(otpContainerElement).findElement(By.id('first')).sendKeys(TOTP[0]);
  await driver.findElement(otpContainerElement).findElement(By.id('second')).sendKeys(TOTP[1]);
  await driver.findElement(otpContainerElement).findElement(By.id('third')).sendKeys(TOTP[2]);
  await driver.findElement(otpContainerElement).findElement(By.id('fourth')).sendKeys(TOTP[3]);
  await driver.findElement(otpContainerElement).findElement(By.id('fifth')).sendKeys(TOTP[4]);
  await driver.findElement(otpContainerElement).findElement(By.id('sixth')).sendKeys(TOTP[5]);

  await driver.findElement(By.id('confirmOtpForm')).findElement(By.id('confirmOtpSubmit')).click();
};

const doLoginFyers = async (username, password, pin, totpSecretKey) => {
  const driver = initializeBrowserDriver();

  console.log('Browser initialized');

  driver.manage().setTimeouts({ implicit: 3000, pageLoad: 300000, script: 30000 })
  await driver.get(`${QUANTMAN_URL}/auth/fyers`);
  
  console.log('Login Page opened');
  await delay(1000);

  console.log(`STEP 1: ENTER USER_ID`);
  await driver.findElement(By.name('fy_client_id')).sendKeys(username);
  await driver.findElement(By.id('clientIdSubmit')).click();

  await delay(1000);

  console.log(`STEP 2: ENTER TOTP`);
  await enterTOTP(driver, totpSecretKey, false);

  await delay(1000);

  const isInValidTOTP = await driver.findElement(By.id('otp_banner')).then(() => true ).catch(e => false );

  if(isInValidTOTP) {
    console.log(`STEP 2: [ENTER TOTP] Reattempt`);
    await delay(1000);
    await enterTOTP(driver, totpSecretKey, true);
  }

  await delay(1000);

  console.log(`STEP 3: ENTER PIN`);
  const verifyPinForm = By.id('verifyPinForm');

  await driver.findElement(verifyPinForm).findElement(By.id('first')).sendKeys(pin[0]);
  await driver.findElement(verifyPinForm).findElement(By.id('second')).sendKeys(pin[1]);
  await driver.findElement(verifyPinForm).findElement(By.id('third')).sendKeys(pin[2]);
  await driver.findElement(verifyPinForm).findElement(By.id('fourth')).sendKeys(pin[3]);

  await driver.findElement(verifyPinForm).findElement(By.id('verifyPinSubmit')).click();

  await delay(1000);

  console.log(`STEP 4: CHECK RETURN TO QUANTMAN PAGE`);
  await driver.wait(until.titleIs('Quantman'), 3000);
  await driver.quit();
};

const doLogin = async (args) => {
  const { username, password, pin, totpSecretKey } = args;

  await doLoginFyers(username, password, pin, totpSecretKey)
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