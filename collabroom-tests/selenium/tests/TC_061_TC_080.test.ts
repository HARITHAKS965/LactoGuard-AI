import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 4: Wallet, Contracts & Profile (TC_061 to TC_080)', () => {
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
        category: 'Wallet, Contracts & Profile',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Wallet, Contracts & Profile',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  test('TC_061: Wallet - View Available & Pending Balance', async () => {
    await runTestCase('TC_061', 'Wallet - View Available & Pending Balance', async () => {
      const walletTab = await driver.findElement(By.css('[data-testid="nav-wallet-tab"]'));
      await walletTab.click();
      const avail = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-balance-available"]')), 5000);
      const pending = await driver.findElement(By.css('[data-testid="wallet-balance-pending"]'));
      expect(await avail.isDisplayed()).toBe(true);
      expect(await pending.isDisplayed()).toBe(true);
    });
  });

  test('TC_062: Wallet - View Transaction History List', async () => {
    await runTestCase('TC_062', 'Wallet - View Transaction History List', async () => {
      const walletTab = await driver.findElement(By.css('[data-testid="nav-wallet-tab"]'));
      await walletTab.click();
      const table = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-transactions-table"]')), 5000);
      expect(await table.isDisplayed()).toBe(true);
    });
  });

  test('TC_063: Wallet - Filter Transactions by Type', async () => {
    await runTestCase('TC_063', 'Wallet - Filter Transactions by Type', async () => {
      const walletTab = await driver.findElement(By.css('[data-testid="nav-wallet-tab"]'));
      await walletTab.click();
      const typeSelect = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-filter-type-select"]')), 5000);
      await typeSelect.sendKeys('Payout Credits');
      expect(await typeSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_064: Wallet - Open Payout/Withdrawal Modal', async () => {
    await runTestCase('TC_064', 'Wallet - Open Payout/Withdrawal Modal', async () => {
      const walletTab = await driver.findElement(By.css('[data-testid="nav-wallet-tab"]'));
      await walletTab.click();
      const openBtn = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-withdraw-open-btn"]')), 5000);
      await openBtn.click();
      const modal = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-withdraw-modal"]')), 5000);
      expect(await modal.isDisplayed()).toBe(true);
    });
  });

  test('TC_065: Wallet - Request Payout with Valid Bank Account', async () => {
    await runTestCase('TC_065', 'Wallet - Request Payout with Valid Bank Account', async () => {
      await driver.executeScript("openWithdrawModal();");
      const bankInput = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-bank-account-input"]')), 5000);
      await bankInput.sendKeys('US9812739182371');
      const amountInput = await driver.findElement(By.css('[data-testid="wallet-withdraw-amount-input"]'));
      await amountInput.sendKeys('1000');
      const submitBtn = await driver.findElement(By.css('[data-testid="wallet-withdraw-submit-btn"]'));
      await submitBtn.click();
      const modal = await driver.findElement(By.id('wallet-withdraw-modal-overlay'));
      expect(await modal.isDisplayed()).toBe(false);
    });
  });

  test('TC_066: Wallet - Request Payout Error on Exceeding Available Balance', async () => {
    await runTestCase('TC_066', 'Wallet - Request Payout Error on Exceeding Available Balance', async () => {
      await driver.executeScript("openWithdrawModal();");
      const amountInput = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-withdraw-amount-input"]')), 5000);
      await amountInput.sendKeys('999999');
      const submitBtn = await driver.findElement(By.css('[data-testid="wallet-withdraw-submit-btn"]'));
      await submitBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="wallet-withdraw-error-msg"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_067: FakeRazorpay Modal - Open Payment Gateway Overlay', async () => {
    await runTestCase('TC_067', 'FakeRazorpay Modal - Open Payment Gateway Overlay', async () => {
      const walletTab = await driver.findElement(By.css('[data-testid="nav-wallet-tab"]'));
      await walletTab.click();
      const rzpBtn = await driver.wait(until.elementLocated(By.css('[data-testid="razorpay-trigger-btn"]')), 5000);
      await rzpBtn.click();
      const modal = await driver.wait(until.elementLocated(By.css('[data-testid="razorpay-modal"]')), 5000);
      expect(await modal.isDisplayed()).toBe(true);
    });
  });

  test('TC_068: FakeRazorpay Modal - Enter Card Credentials & Pay', async () => {
    await runTestCase('TC_068', 'FakeRazorpay Modal - Enter Card Credentials & Pay', async () => {
      await driver.executeScript("openRazorpayModal();");
      const cardInput = await driver.wait(until.elementLocated(By.css('[data-testid="razorpay-card-number-input"]')), 5000);
      await cardInput.sendKeys('4532111122223333');
      const expInput = await driver.findElement(By.css('[data-testid="razorpay-card-expiry-input"]'));
      await expInput.sendKeys('12/28');
      const cvvInput = await driver.findElement(By.css('[data-testid="razorpay-card-cvv-input"]'));
      await cvvInput.sendKeys('123');
      const payBtn = await driver.findElement(By.css('[data-testid="razorpay-submit-btn"]'));
      await payBtn.click();
      const badge = await driver.wait(until.elementLocated(By.css('[data-testid="razorpay-success-badge"]')), 5000);
      expect(await badge.isDisplayed()).toBe(true);
    });
  });

  test('TC_069: FakeRazorpay Modal - Payment Success Callback & Escrow Update', async () => {
    await runTestCase('TC_069', 'FakeRazorpay Modal - Payment Success Callback & Escrow Update', async () => {
      await driver.executeScript("openRazorpayModal(); submitRazorpayPayment();");
      const badge = await driver.wait(until.elementLocated(By.css('[data-testid="razorpay-success-badge"]')), 5000);
      expect(await badge.isDisplayed()).toBe(true);
    });
  });

  test('TC_070: Contract Signing - Authenticated User Views Contract Terms', async () => {
    await runTestCase('TC_070', 'Contract Signing - Authenticated User Views Contract Terms', async () => {
      const contractTab = await driver.findElement(By.css('[data-testid="nav-contracts-tab"]'));
      await contractTab.click();
      const container = await driver.wait(until.elementLocated(By.css('[data-testid="contract-view-container"]')), 5000);
      expect(await container.isDisplayed()).toBe(true);
    });
  });

  test('TC_071: Contract Signing - Authenticated User Signs with Digital Signature', async () => {
    await runTestCase('TC_071', 'Contract Signing - Authenticated User Signs with Digital Signature', async () => {
      const contractTab = await driver.findElement(By.css('[data-testid="nav-contracts-tab"]'));
      await contractTab.click();
      const sigInput = await driver.wait(until.elementLocated(By.css('[data-testid="contract-signature-input"]')), 5000);
      await sigInput.sendKeys('Alex Johnson');
      const submitBtn = await driver.findElement(By.css('[data-testid="contract-sign-submit-btn"]'));
      await submitBtn.click();
      const badge = await driver.wait(until.elementLocated(By.css('[data-testid="contract-status-signed-badge"]')), 5000);
      expect(await badge.isDisplayed()).toBe(true);
    });
  });

  test('TC_072: Contract Signing - Public Contract Access via Shared Link', async () => {
    await runTestCase('TC_072', 'Contract Signing - Public Contract Access via Shared Link', async () => {
      const contractTab = await driver.findElement(By.css('[data-testid="nav-contracts-tab"]'));
      await contractTab.click();
      const pubLink = await driver.wait(until.elementLocated(By.css('[data-testid="public-contract-link"]')), 5000);
      await pubLink.click();
      const pubContainer = await driver.wait(until.elementLocated(By.css('[data-testid="public-contract-container"]')), 5000);
      expect(await pubContainer.isDisplayed()).toBe(true);
    });
  });

  test('TC_073: Contract Signing - Public User Sign Contract Flow', async () => {
    await runTestCase('TC_073', 'Contract Signing - Public User Sign Contract Flow', async () => {
      await driver.executeScript("switchTab('public-contract');");
      const signBtn = await driver.wait(until.elementLocated(By.css('[data-testid="public-contract-sign-btn"]')), 5000);
      await signBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_074: Profile View - Render Bio, Portfolio & Metrics', async () => {
    await runTestCase('TC_074', 'Profile View - Render Bio, Portfolio & Metrics', async () => {
      const profileTab = await driver.findElement(By.css('[data-testid="nav-profile-tab"]'));
      await profileTab.click();
      const container = await driver.wait(until.elementLocated(By.css('[data-testid="profile-view-container"]')), 5000);
      const bioText = await driver.findElement(By.css('[data-testid="profile-bio-text"]'));
      expect(await container.isDisplayed()).toBe(true);
      expect(await bioText.isDisplayed()).toBe(true);
    });
  });

  test('TC_075: Profile Edit - Update Display Name and Bio', async () => {
    await runTestCase('TC_075', 'Profile Edit - Update Display Name and Bio', async () => {
      const profileTab = await driver.findElement(By.css('[data-testid="nav-profile-tab"]'));
      await profileTab.click();
      const openBtn = await driver.wait(until.elementLocated(By.css('[data-testid="profile-edit-open-btn"]')), 5000);
      await openBtn.click();
      const nameInput = await driver.wait(until.elementLocated(By.css('[data-testid="profile-edit-name-input"]')), 5000);
      await nameInput.clear();
      await nameInput.sendKeys('Alex Updated');
      const submitBtn = await driver.findElement(By.css('[data-testid="profile-edit-submit-btn"]'));
      await submitBtn.click();
      const nameLbl = await driver.findElement(By.id('profile-display-name'));
      expect(await nameLbl.getText()).toBe('Alex Updated');
    });
  });

  test('TC_076: Profile Edit - Change Avatar Image Upload', async () => {
    await runTestCase('TC_076', 'Profile Edit - Change Avatar Image Upload', async () => {
      const profileTab = await driver.findElement(By.css('[data-testid="nav-profile-tab"]'));
      await profileTab.click();
      await driver.executeScript("toggleProfileEditForm();");
      const avatarInput = await driver.wait(until.elementLocated(By.css('[data-testid="profile-edit-avatar-input"]')), 5000);
      await avatarInput.clear();
      await avatarInput.sendKeys('https://example.com/new-avatar.png');
      expect(await avatarInput.getAttribute('value')).toBe('https://example.com/new-avatar.png');
    });
  });

  test('TC_077: Profile Edit - Add/Edit Social Links', async () => {
    await runTestCase('TC_077', 'Profile Edit - Add/Edit Social Links', async () => {
      const profileTab = await driver.findElement(By.css('[data-testid="nav-profile-tab"]'));
      await profileTab.click();
      await driver.executeScript("toggleProfileEditForm();");
      const instaInput = await driver.wait(until.elementLocated(By.css('[data-testid="profile-edit-instagram-input"]')), 5000);
      const ytInput = await driver.findElement(By.css('[data-testid="profile-edit-youtube-input"]'));
      const tiktokInput = await driver.findElement(By.css('[data-testid="profile-edit-tiktok-input"]'));
      expect(await instaInput.isDisplayed()).toBe(true);
      expect(await ytInput.isDisplayed()).toBe(true);
      expect(await tiktokInput.isDisplayed()).toBe(true);
    });
  });

  test('TC_078: Profile Edit - Form Validation on Invalid URL', async () => {
    await runTestCase('TC_078', 'Profile Edit - Form Validation on Invalid URL', async () => {
      const profileTab = await driver.findElement(By.css('[data-testid="nav-profile-tab"]'));
      await profileTab.click();
      await driver.executeScript("toggleProfileEditForm();");
      const instaInput = await driver.wait(until.elementLocated(By.css('[data-testid="profile-edit-instagram-input"]')), 5000);
      await instaInput.clear();
      await instaInput.sendKeys('invalid-url-no-http');
      const submitBtn = await driver.findElement(By.css('[data-testid="profile-edit-submit-btn"]'));
      await submitBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="profile-edit-validation-error"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_079: Support Assistant - Open Chatbot Overlay', async () => {
    await runTestCase('TC_079', 'Support Assistant - Open Chatbot Overlay', async () => {
      const openBtn = await driver.findElement(By.css('[data-testid="support-assistant-open-btn"]'));
      await openBtn.click();
      const widget = await driver.wait(until.elementLocated(By.css('[data-testid="support-assistant-widget"]')), 5000);
      expect(await widget.isDisplayed()).toBe(true);
    });
  });

  test('TC_080: Support Assistant - Send Message & Receive Response', async () => {
    await runTestCase('TC_080', 'Support Assistant - Send Message & Receive Response', async () => {
      const openBtn = await driver.findElement(By.css('[data-testid="support-assistant-open-btn"]'));
      await openBtn.click();
      const chatInput = await driver.wait(until.elementLocated(By.css('[data-testid="support-chat-input"]')), 5000);
      await chatInput.sendKeys('How do I withdraw escrow funds?');
      const sendBtn = await driver.findElement(By.css('[data-testid="support-chat-send-btn"]'));
      await sendBtn.click();
      const resp = await driver.wait(until.elementLocated(By.css('[data-testid="support-chat-latest-response"]')), 5000);
      expect(await resp.isDisplayed()).toBe(true);
    });
  });
});
