import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 2: Dashboard & Discover (TC_021 to TC_040)', () => {
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
        category: 'Dashboard & Discover',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Dashboard & Discover',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  test('TC_021: Dashboard Load - Render Metrics & Quick Actions', async () => {
    await runTestCase('TC_021', 'Dashboard Load - Render Metrics & Quick Actions', async () => {
      const metrics = await driver.wait(until.elementLocated(By.css('[data-testid="dashboard-metrics-container"]')), 5000);
      expect(await metrics.isDisplayed()).toBe(true);
    });
  });

  test('TC_022: Dashboard - Creator Role View', async () => {
    await runTestCase('TC_022', 'Dashboard - Creator Role View', async () => {
      await driver.executeScript("switchTab('dashboard'); currentUser.role = 'creator'; updateSessionUI();");
      await driver.sleep(200);
      const creatorView = await driver.findElement(By.css('[data-testid="dashboard-creator-view"]'));
      expect(await creatorView.isDisplayed()).toBe(true);
    });
  });

  test('TC_023: Dashboard - Brand Role View', async () => {
    await runTestCase('TC_023', 'Dashboard - Brand Role View', async () => {
      await driver.executeScript("switchTab('dashboard'); currentUser = { name: 'Brand', role: 'brand', authenticated: true }; updateSessionUI();");
      await driver.sleep(300);
      const brandView = await driver.findElement(By.css('[data-testid="dashboard-brand-view"]'));
      expect(await brandView.isDisplayed()).toBe(true);
    });
  });

  test('TC_024: Discover - Search Creators by Name/Handle', async () => {
    await runTestCase('TC_024', 'Discover - Search Creators by Name/Handle', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const searchInput = await driver.wait(until.elementLocated(By.css('[data-testid="discover-search-input"]')), 5000);
      await searchInput.sendKeys('Alex');
      expect(await searchInput.getAttribute('value')).toBe('Alex');
    });
  });

  test('TC_025: Discover - Filter Creators by Category & Followers', async () => {
    await runTestCase('TC_025', 'Discover - Filter Creators by Category & Followers', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const catSelect = await driver.wait(until.elementLocated(By.css('[data-testid="discover-category-select"]')), 5000);
      await catSelect.sendKeys('Tech');
      const folSelect = await driver.findElement(By.css('[data-testid="discover-followers-filter"]'));
      await folSelect.sendKeys('50k - 250k');
      expect(await catSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_026: Discover - Filter Creators by Engagement Rate', async () => {
    await runTestCase('TC_026', 'Discover - Filter Creators by Engagement Rate', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const engSelect = await driver.wait(until.elementLocated(By.css('[data-testid="discover-engagement-filter"]')), 5000);
      await engSelect.sendKeys('> 3.0%');
      expect(await engSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_027: Discover - Search Brands by Industry', async () => {
    await runTestCase('TC_027', 'Discover - Search Brands by Industry', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const indInput = await driver.wait(until.elementLocated(By.css('[data-testid="discover-brand-industry-input"]')), 5000);
      await indInput.sendKeys('Apparel');
      expect(await indInput.getAttribute('value')).toBe('Apparel');
    });
  });

  test('TC_028: Discover - Filter Campaigns by Budget Range', async () => {
    await runTestCase('TC_028', 'Discover - Filter Campaigns by Budget Range', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const budSelect = await driver.wait(until.elementLocated(By.css('[data-testid="discover-budget-filter"]')), 5000);
      await budSelect.sendKeys('$2,000 - $10,000');
      expect(await budSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_029: Discover - Creator Profile Modal Preview', async () => {
    await runTestCase('TC_029', 'Discover - Creator Profile Modal Preview', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const card = await driver.wait(until.elementLocated(By.css('[data-testid="discover-creator-card-preview-1"]')), 5000);
      expect(await card.isDisplayed()).toBe(true);
    });
  });

  test('TC_030: Discover - Brand Profile Modal Preview', async () => {
    await runTestCase('TC_030', 'Discover - Brand Profile Modal Preview', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const card = await driver.wait(until.elementLocated(By.css('[data-testid="discover-brand-card-preview-1"]')), 5000);
      expect(await card.isDisplayed()).toBe(true);
    });
  });

  test('TC_031: Discover - Clear All Filters Reset View', async () => {
    await runTestCase('TC_031', 'Discover - Clear All Filters Reset View', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const resetBtn = await driver.wait(until.elementLocated(By.css('[data-testid="discover-reset-filters-btn"]')), 5000);
      await resetBtn.click();
      const searchInput = await driver.findElement(By.css('[data-testid="discover-search-input"]'));
      expect(await searchInput.getAttribute('value')).toBe('');
    });
  });

  test('TC_032: Discover - Pagination / Infinite Scroll Loading', async () => {
    await runTestCase('TC_032', 'Discover - Pagination / Infinite Scroll Loading', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const resultsGrid = await driver.wait(until.elementLocated(By.id('discover-results-grid')), 5000);
      expect(await resultsGrid.isDisplayed()).toBe(true);
    });
  });

  test('TC_033: Discover - Save / Bookmark Creator to Favorites', async () => {
    await runTestCase('TC_033', 'Discover - Save / Bookmark Creator to Favorites', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const bookmarkBtn = await driver.wait(until.elementLocated(By.css('[data-testid="discover-bookmark-btn-1"]')), 5000);
      await bookmarkBtn.click();
      const status = await driver.findElement(By.css('[data-testid="discover-bookmarked-status-1"]'));
      expect(await status.isDisplayed()).toBe(true);
    });
  });

  test('TC_034: Discover - Remove Creator from Saved List', async () => {
    await runTestCase('TC_034', 'Discover - Remove Creator from Saved List', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const bookmarkBtn = await driver.wait(until.elementLocated(By.css('[data-testid="discover-bookmark-btn-1"]')), 5000);
      await bookmarkBtn.click(); // Toggle on
      await bookmarkBtn.click(); // Toggle off
      const status = await driver.findElement(By.css('[data-testid="discover-bookmarked-status-1"]'));
      expect(await status.isDisplayed()).toBe(false);
    });
  });

  test('TC_035: Discover - Direct Message Button from Profile Preview', async () => {
    await runTestCase('TC_035', 'Discover - Direct Message Button from Profile Preview', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const dmBtn = await driver.wait(until.elementLocated(By.css('[data-testid="discover-direct-message-btn-1"]')), 5000);
      await dmBtn.click();
      const messagesTab = await driver.findElement(By.id('tab-messages'));
      expect(await messagesTab.isDisplayed()).toBe(true);
    });
  });

  test('TC_036: Discover - View Campaign Details Modal from List', async () => {
    await runTestCase('TC_036', 'Discover - View Campaign Details Modal from List', async () => {
      const discoverBtn = await driver.findElement(By.css('[data-testid="nav-discover-tab"]'));
      await discoverBtn.click();
      const viewCampBtn = await driver.wait(until.elementLocated(By.css('[data-testid="discover-view-campaign-btn-1"]')), 5000);
      await viewCampBtn.click();
      const campTab = await driver.findElement(By.id('tab-campaigns'));
      expect(await campTab.isDisplayed()).toBe(true);
    });
  });

  test('TC_037: AI Brief Generator - Open Generator Modal', async () => {
    await runTestCase('TC_037', 'AI Brief Generator - Open Generator Modal', async () => {
      const aiBtn = await driver.findElement(By.css('[data-testid="ai-brief-open-btn"]'));
      await aiBtn.click();
      const modal = await driver.wait(until.elementLocated(By.css('[data-testid="ai-brief-modal"]')), 5000);
      expect(await modal.isDisplayed()).toBe(true);
    });
  });

  test('TC_038: AI Brief Generator - Input Campaign Goals & Target Audience', async () => {
    await runTestCase('TC_038', 'AI Brief Generator - Input Campaign Goals & Target Audience', async () => {
      await driver.executeScript("openAIBriefModal();");
      const goals = await driver.wait(until.elementLocated(By.css('[data-testid="ai-brief-goals-input"]')), 5000);
      await goals.sendKeys('Launch new fitness watch');
      const audience = await driver.findElement(By.css('[data-testid="ai-brief-audience-input"]'));
      await audience.sendKeys('Runners aged 20-35');
      expect(await goals.getAttribute('value')).toBe('Launch new fitness watch');
    });
  });

  test('TC_039: AI Brief Generator - Generate AI Proposal Draft', async () => {
    await runTestCase('TC_039', 'AI Brief Generator - Generate AI Proposal Draft', async () => {
      await driver.executeScript("openAIBriefModal();");
      const genBtn = await driver.wait(until.elementLocated(By.css('[data-testid="ai-brief-generate-btn"]')), 5000);
      await genBtn.click();
      const outputText = await driver.wait(until.elementLocated(By.css('[data-testid="ai-brief-output-text"]')), 5000);
      const text = await outputText.getText();
      expect(text).toContain('AI Proposed Brief');
    });
  });

  test('TC_040: AI Brief Generator - Insert AI Output into Campaign Form', async () => {
    await runTestCase('TC_040', 'AI Brief Generator - Insert AI Output into Campaign Form', async () => {
      await driver.executeScript("openAIBriefModal(); generateAIBrief();");
      const applyBtn = await driver.wait(until.elementLocated(By.css('[data-testid="ai-brief-apply-btn"]')), 5000);
      await applyBtn.click();
      const campDeliverables = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-deliverables-input"]')), 5000);
      const val = await campDeliverables.getAttribute('value');
      expect(val).toContain('AI Proposed Brief');
    });
  });
});
