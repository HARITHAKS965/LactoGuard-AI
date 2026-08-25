import { Builder, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

const chromedriver = require('chromedriver');

export async function createWebDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--window-size=1280,800',
    '--remote-allow-origins=*'
  );

  const service = new chrome.ServiceBuilder(chromedriver.path);

  return new Builder()
    .forBrowser('chrome')
    .setChromeService(service)
    .setChromeOptions(options)
    .build();
}
