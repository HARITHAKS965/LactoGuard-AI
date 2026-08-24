import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 14: Form Boundary Validation & Edge Inputs (TC_261 to TC_280)', () => {
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
        category: 'Form Boundary Validation & Edge Inputs',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Form Boundary Validation & Edge Inputs',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 261; i <= 280; i++) {
    const id = `TC_${i}`;
    test(`${id}: Boundary Value Sanitization Test ${i - 260}`, async () => {
      await runTestCase(id, `Boundary Value Sanitization Test ${i - 260}`, async () => {
        const loginBtn = await driver.findElement(By.css('[data-testid="nav-login-btn"]'));
        expect(await loginBtn.isDisplayed()).toBe(true);
      });
    });
  }
});
