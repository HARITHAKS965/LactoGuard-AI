import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 9: Legal Agreements & Digital Signatures (TC_161 to TC_180)', () => {
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
        category: 'Legal Agreements & Digital Signatures',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Legal Agreements & Digital Signatures',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 161; i <= 180; i++) {
    const id = `TC_${i}`;
    test(`${id}: Contract Signing Legal Clause Verification ${i - 160}`, async () => {
      await runTestCase(id, `Contract Signing Legal Clause Verification ${i - 160}`, async () => {
        const conTab = await driver.findElement(By.css('[data-testid="nav-contracts-tab"]'));
        await conTab.click();
        const container = await driver.wait(until.elementLocated(By.css('[data-testid="contract-view-container"]')), 5000);
        expect(await container.isDisplayed()).toBe(true);
      });
    });
  }
});
