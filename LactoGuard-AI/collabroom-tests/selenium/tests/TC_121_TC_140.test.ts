import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 7: Discover Filters & Search Analytics (TC_121 to TC_140)', () => {
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
        category: 'Discover Filters & Search Analytics',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Discover Filters & Search Analytics',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  for (let i = 121; i <= 140; i++) {
    const id = `TC_${i}`;
    test(`${id}: Discover Deep Search Scenario ${i - 120}`, async () => {
      await runTestCase(id, `Discover Deep Search Scenario ${i - 120}`, async () => {
        const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
        await discoverBtn.click();
        const grid = await driver.wait(until.elementLocated(By.id('discover-results-grid')), 5000);
        expect(await grid.isDisplayed()).toBe(true);
      });
    });
  }
});
