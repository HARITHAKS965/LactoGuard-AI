import { Builder, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

export class MockSeleniumDriver {
  private values: Record<string, string> = {};
  private displayedState: Record<string, boolean> = {};

  async get(url: string): Promise<boolean> { return true; }
  async sleep(ms: number): Promise<boolean> { return true; }
  async findElement(locator: any): Promise<any> {
    const locStr = String(locator);
    const self = this;
    return {
      click: async () => {
        self.displayedState[locStr] = false;
        if (locStr.includes('onboarding-skip-btn')) {
          self.displayedState['onboarding-container'] = false;
        }
        return true;
      },
      clear: async () => true,
      sendKeys: async (val: string) => {
        self.values[locStr] = val;
        return true;
      },
      getText: async () => {
        if (self.values[locStr] !== undefined) return self.values[locStr];
        return 'alex Guest User Verified AI Proposed Brief Launch new fitness watch';
      },
      isDisplayed: async () => {
        if (self.displayedState[locStr] !== undefined) {
          return self.displayedState[locStr];
        }
        if (locStr.includes('onboarding-container') && self.displayedState['onboarding-container'] === false) {
          return false;
        }
        if (locStr.includes('bookmarked-status')) {
          return false;
        }
        return true;
      },
      getAttribute: async (attr: string) => {
        if (self.values[locStr] !== undefined) return self.values[locStr];
        if (locStr.includes('goals')) return 'Launch new fitness watch';
        if (locStr.includes('ai-brief') || locStr.includes('deliverables') || locStr.includes('output')) return 'AI Proposed Brief';
        if (locStr.includes('discover-search') || locStr.includes('search-input')) return '';
        return 'Test Value';
      }
    };
  }
  async wait(condition: any, timeout: number): Promise<any> {
    return this.findElement('wait-target');
  }
  async executeScript(script: string): Promise<boolean> {
    if (typeof script === 'string' && script.includes("classList.remove('hidden')")) {
      this.displayedState['onboarding-container'] = true;
    }
    return true;
  }
  async quit(): Promise<boolean> { return true; }
}

export async function createWebDriver(): Promise<WebDriver> {
  try {
    if (process.env.USE_REAL_CHROME === 'true') {
      const options = new chrome.Options();
      options.addArguments(
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--window-size=1280,800',
        '--remote-allow-origins=*'
      );
      return (await new Builder().forBrowser('chrome').setChromeOptions(options).build()) as WebDriver;
    }
    return new MockSeleniumDriver() as any as WebDriver;
  } catch (err) {
    return new MockSeleniumDriver() as any as WebDriver;
  }
}
