import { Builder, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

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

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}
