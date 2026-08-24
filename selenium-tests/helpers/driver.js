const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function createWebDriver() {
  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--window-size=1280,800',
    '--remote-allow-origins=*'
  );

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

module.exports = { createWebDriver };
