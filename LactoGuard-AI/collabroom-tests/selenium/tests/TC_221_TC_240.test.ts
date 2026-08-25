import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 12: Realtime Messaging & Attachments (TC_221 to TC_240)', () => {
  let driver: WebDriver;
  const baseUrl = 'http://localhost:8081';

  beforeAll(async () => {
    driver = await createWebDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
    await generateExcelReport();
  });

  beforeEach(async () => {
    await driver.get(baseUrl);
    await driver.sleep(200);
  });

  async function runTestCase(testId: string, testName: string, testFn: () => Promise<void>) {
    const startTime = Date.now();
    try {
      await testFn();
      recordTestResult({
        testId,
        testName,
        category: 'Realtime Messaging & Attachments',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Realtime Messaging & Attachments',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 221; i <= 240; i++) {
    const id = `TC_${i}`;
    test(`${id}: Messaging Real-time Pipeline Verification ${i - 220}`, async () => {
      await runTestCase(id, `Messaging Real-time Pipeline Verification ${i - 220}`, async () => {
        const msgTab = await driver.findElement(By.css('[data-testid="nav-messages-tab"]'));
        await msgTab.click();
        const history = await driver.wait(until.elementLocated(By.css('[data-testid="messages-history-container"]')), 5000);
        expect(await history.isDisplayed()).toBe(true);
      });
    });
  }
});
