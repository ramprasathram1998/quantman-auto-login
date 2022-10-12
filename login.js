require('dotenv').config({ path: process.env.DOT_ENV_PATH });

const FYERS = require('./Brokers/fyers');
const ANGEL_BROKING = require('./Brokers/angelBroking');
const ICICI = require('./Brokers/icici');
const ZERODHA = require('./Brokers/zerodha');
const ALICE_BLUE = require('./Brokers/aliceBlue');
const ZEBULL = require('./Brokers/zebull');
const FLATTRADE = require('./Brokers/flatTrade');
const JAINAM_DUCK = require('./Brokers/jainamDuck');

const { customizedSplit } = require('./Brokers/helper');

const AVAILABLE_BROKERS = {
  FYERS,
  ANGEL_BROKING,
  ICICI,
  ZERODHA, // T-otp (so stopped)
  ALICE_BLUE,
  ZEBULL,
  FLATTRADE,
  JAINAM_DUCK
}

const brokers = customizedSplit(process.env['BROKERS']);
const usernames = customizedSplit(process.env['USERNAMES']);
const passwords = customizedSplit(process.env['PASSWORDS']);
const pins = customizedSplit(process.env['PINS']);
const yearOfBirth = process.env['YEAR_OF_BIRTH'];
const totpSecretKeys = customizedSplit(process.env['TOTP_SECRET_KEYS']);
const securityQuestions1 = customizedSplit(process.env['SECURITY_QUESTIONS1']);
const securityQuestions2 = customizedSplit(process.env['SECURITY_QUESTIONS2']);

const loginFunc = async () => {
  let index = 0;
  for (const broker of brokers) {

    const args = {
      username: usernames[index] || '',
      password: passwords[index] || '',
      pin: pins[index] || '',
      totpSecretKey: totpSecretKeys[index] || '',
      securityQuestion1: securityQuestions1[index] || '',
      securityQuestion2: securityQuestions2[index] || '',
      yearOfBirth
    };

    console.log('BROKER ----->', broker);
    await AVAILABLE_BROKERS[broker].doLogin(args)

    index++;
  };
}

loginFunc();
