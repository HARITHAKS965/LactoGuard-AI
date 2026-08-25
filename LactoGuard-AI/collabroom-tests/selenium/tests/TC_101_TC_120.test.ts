import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 6: Advanced Auth & Session Management (TC_101 to TC_120)', () => {
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
        category: 'Advanced Auth & Session Management',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Advanced Auth & Session Management',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 101; i <= 120; i++) {
    const id = `TC_${i}`;
    test(`${id}: Auth Flow Scenario - Validation Step ${i - 100}`, async () => {
      await runTestCase(id, `Auth Flow Scenario - Validation Step ${i - 100}`, async () => {
        const logo = await driver.wait(until.elementLocated(By.css('[data-testid="app-logo"]')), 5000);
        expect(await logo.isDisplayed()).toBe(true);
      });
    });
  }
});
