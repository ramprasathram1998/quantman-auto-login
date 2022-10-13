const OTPAuth = require('otpauth');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const SCREEN_SIZE = { width: 700, height: 700 };
const QUANTMAN_URL = 'https://www.quantman.in';
const QUANTMAN_SIGN_IN_URL = 'https://www.quantman.in/users/sign_in';
const ZEBU_LOGIN_URL = 'https://zebull.in/#/login';

const customizedSplit = (values = []) => values.split(',').map(value => value.trim())

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchTOTP = async (broker,totpSecretKey) => {
  const totp_uri = OTPAuth.URI.parse(`otpauth://totp/${broker}?secret=${totpSecretKey}`);
  return totp_uri.generate();
};

const initializeBrowserDriver = () => {
  var driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize(SCREEN_SIZE))
    .build();
  
  if (process.env.NODE_ENV == 'development') {
    driver = new Builder().forBrowser('chrome').build();
  }

  return driver;
};

module.exports = {
  customizedSplit,
  delay,
  fetchTOTP,
  initializeBrowserDriver,
  QUANTMAN_URL,
  QUANTMAN_SIGN_IN_URL,
  ZEBU_LOGIN_URL,
};
