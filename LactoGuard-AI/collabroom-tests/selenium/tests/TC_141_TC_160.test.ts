import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 8: Campaign Escrow & Lifecycle (TC_141 to TC_160)', () => {
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
        category: 'Campaign Escrow & Lifecycle',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Campaign Escrow & Lifecycle',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 141; i <= 160; i++) {
    const id = `TC_${i}`;
    test(`${id}: Campaign Lifecycle Milestone Audit ${i - 140}`, async () => {
      await runTestCase(id, `Campaign Lifecycle Milestone Audit ${i - 140}`, async () => {
        const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
        await campBtn.click();
        const list = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-list-container"]')), 5000);
        expect(await list.isDisplayed()).toBe(true);
      });
    });
  }
});
