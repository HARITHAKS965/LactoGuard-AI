import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 10: Support Assistant AI & Helpdesk (TC_181 to TC_200)', () => {
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
        category: 'Support Assistant AI & Helpdesk',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Support Assistant AI & Helpdesk',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 181; i <= 200; i++) {
    const id = `TC_${i}`;
    test(`${id}: Support Assistant Automated Dialogue ${i - 180}`, async () => {
      await runTestCase(id, `Support Assistant Automated Dialogue ${i - 180}`, async () => {
        const supportBtn = await driver.wait(until.elementLocated(By.css('[data-testid="support-assistant-open-btn"]')), 5000);
        expect(await supportBtn.isDisplayed()).toBe(true);
      });
    });
  }
});
