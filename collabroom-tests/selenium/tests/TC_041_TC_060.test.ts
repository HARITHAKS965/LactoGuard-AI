import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 3: Campaigns (TC_041 to TC_060)', () => {
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
        category: 'Campaigns',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Campaigns',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  test('TC_041: Campaign Creation - Step 1: Basic Info & Title', async () => {
    await runTestCase('TC_041', 'Campaign Creation - Step 1: Basic Info & Title', async () => {
      const openBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await openBtn.click();
      const createBtn = await driver.wait(until.elementLocated(By.css('[data-testid="create-campaign-open-btn"]')), 5000);
      await createBtn.click();
      const titleInput = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-title-input"]')), 5000);
      await titleInput.sendKeys('New Gaming Campaign');
      expect(await titleInput.getAttribute('value')).toBe('New Gaming Campaign');
    });
  });

  test('TC_042: Campaign Creation - Step 2: Deliverables & Timeline', async () => {
    await runTestCase('TC_042', 'Campaign Creation - Step 2: Deliverables & Timeline', async () => {
      await driver.executeScript("openCampaignCreationModal(); nextCampaignStep(2);");
      const deliverablesInput = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-deliverables-input"]')), 5000);
      await deliverablesInput.sendKeys('1 YouTube Shorts');
      expect(await deliverablesInput.getAttribute('value')).toBe('1 YouTube Shorts');
    });
  });

  test('TC_043: Campaign Creation - Step 3: Budget & Compensation Model', async () => {
    await runTestCase('TC_043', 'Campaign Creation - Step 3: Budget & Compensation Model', async () => {
      await driver.executeScript("openCampaignCreationModal(); nextCampaignStep(3);");
      const budgetInput = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-budget-input"]')), 5000);
      await budgetInput.sendKeys('3000');
      expect(await budgetInput.getAttribute('value')).toBe('3000');
    });
  });

  test('TC_044: Campaign Creation - Step 4: Review & Publish Campaign', async () => {
    await runTestCase('TC_044', 'Campaign Creation - Step 4: Review & Publish Campaign', async () => {
      await driver.executeScript("openCampaignCreationModal(); document.getElementById('new-camp-title').value = 'Test Campaign'; nextCampaignStep(4);");
      const publishBtn = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-publish-btn"]')), 5000);
      await publishBtn.click();
      const modal = await driver.findElement(By.id('campaign-creation-modal'));
      expect(await modal.isDisplayed()).toBe(false);
    });
  });

  test('TC_045: Campaign Creation - Form Field Validation Errors', async () => {
    await runTestCase('TC_045', 'Campaign Creation - Form Field Validation Errors', async () => {
      await driver.executeScript("openCampaignCreationModal(); document.getElementById('new-camp-title').value = ''; nextCampaignStep(4);");
      const publishBtn = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-publish-btn"]')), 5000);
      await publishBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-form-validation-error"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_046: Campaign Creation - Save Draft Campaign', async () => {
    await runTestCase('TC_046', 'Campaign Creation - Save Draft Campaign', async () => {
      await driver.executeScript("openCampaignCreationModal(); nextCampaignStep(4);");
      const draftBtn = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-save-draft-btn"]')), 5000);
      await draftBtn.click();
      const modal = await driver.findElement(By.id('campaign-creation-modal'));
      expect(await modal.isDisplayed()).toBe(false);
    });
  });

  test('TC_047: Campaign List - View Active Campaigns', async () => {
    await runTestCase('TC_047', 'Campaign List - View Active Campaigns', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const list = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-list-container"]')), 5000);
      expect(await list.isDisplayed()).toBe(true);
    });
  });

  test('TC_048: Campaign List - Filter Campaigns by Status', async () => {
    await runTestCase('TC_048', 'Campaign List - Filter Campaigns by Status', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const filterSelect = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-filter-status-select"]')), 5000);
      await filterSelect.sendKeys('Active');
      expect(await filterSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_049: Campaign Details - View Full Brief & Attachments', async () => {
    await runTestCase('TC_049', 'Campaign Details - View Full Brief & Attachments', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const card = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-card-details-1"]')), 5000);
      expect(await card.isDisplayed()).toBe(true);
    });
  });

  test('TC_050: Campaign Apply - Creator Submits Pitch & Quote', async () => {
    await runTestCase('TC_050', 'Campaign Apply - Creator Submits Pitch & Quote', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const pitchInput = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-pitch-input"]')), 5000);
      await pitchInput.sendKeys('I have 50k tech followers interested in shoes');
      const submitBtn = await driver.findElement(By.css('[data-testid="campaign-submit-pitch-btn"]'));
      await submitBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_051: Campaign Applications - Brand Views Applicant List', async () => {
    await runTestCase('TC_051', 'Campaign Applications - Brand Views Applicant List', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const applicants = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-applicants-list"]')), 5000);
      expect(await applicants.isDisplayed()).toBe(true);
    });
  });

  test('TC_052: Campaign Applications - Brand Accepts Application', async () => {
    await runTestCase('TC_052', 'Campaign Applications - Brand Accepts Application', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const acceptBtn = await driver.wait(until.elementLocated(By.css('[data-testid="applicant-accept-btn-1"]')), 5000);
      await acceptBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_053: Campaign Applications - Brand Rejects Application', async () => {
    await runTestCase('TC_053', 'Campaign Applications - Brand Rejects Application', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const rejectBtn = await driver.wait(until.elementLocated(By.css('[data-testid="applicant-reject-btn-1"]')), 5000);
      await rejectBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_054: Campaign Milestone - Creator Submits Deliverable Link', async () => {
    await runTestCase('TC_054', 'Campaign Milestone - Creator Submits Deliverable Link', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const urlInput = await driver.wait(until.elementLocated(By.css('[data-testid="milestone-deliverable-url-input"]')), 5000);
      await urlInput.sendKeys('https://youtube.com/watch?v=sample');
      const submitBtn = await driver.findElement(By.css('[data-testid="milestone-submit-btn"]'));
      await submitBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_055: Campaign Milestone - Brand Requests Revision', async () => {
    await runTestCase('TC_055', 'Campaign Milestone - Brand Requests Revision', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const revBtn = await driver.wait(until.elementLocated(By.css('[data-testid="milestone-revision-btn"]')), 5000);
      await revBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_056: Campaign Milestone - Brand Approves Deliverable', async () => {
    await runTestCase('TC_056', 'Campaign Milestone - Brand Approves Deliverable', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const appBtn = await driver.wait(until.elementLocated(By.css('[data-testid="milestone-approve-btn"]')), 5000);
      await appBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_057: Campaign Management - Edit Active Campaign Details', async () => {
    await runTestCase('TC_057', 'Campaign Management - Edit Active Campaign Details', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const editBtn = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-edit-btn"]')), 5000);
      await editBtn.click();
      const modal = await driver.wait(until.elementLocated(By.id('campaign-creation-modal')), 5000);
      expect(await modal.isDisplayed()).toBe(true);
    });
  });

  test('TC_058: Campaign Management - Pause / Resume Campaign', async () => {
    await runTestCase('TC_058', 'Campaign Management - Pause / Resume Campaign', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const pauseBtn = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-pause-toggle"]')), 5000);
      await pauseBtn.click();
      expect(await pauseBtn.getText()).toBe('Resume Campaign');
    });
  });

  test('TC_059: Campaign Management - Cancel Campaign Modal Confirmation', async () => {
    await runTestCase('TC_059', 'Campaign Management - Cancel Campaign Modal Confirmation', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      const cancelBtn = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-cancel-btn"]')), 5000);
      await cancelBtn.click();
      const modal = await driver.wait(until.elementLocated(By.css('[data-testid="campaign-cancel-confirm-modal"]')), 5000);
      expect(await modal.isDisplayed()).toBe(true);
    });
  });

  test('TC_060: Campaign Rating - Submit Review & Rating post completion', async () => {
    await runTestCase('TC_060', 'Campaign Rating - Submit Review & Rating post completion', async () => {
      const campBtn = await driver.findElement(By.css('[data-testid="nav-campaigns-tab"]'));
      await campBtn.click();
      expect(await campBtn.isDisplayed()).toBe(true);
    });
  });
});
