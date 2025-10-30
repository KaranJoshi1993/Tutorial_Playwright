import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import HomePage from '../pages/sidebarButtons.page';
import { LoginPage } from '../pages/login.page';
import { email, password } from '../utils/credentials';
import { NEW_QUOTE_SELECTORS } from '../locators/locators';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let homePage: HomePage;
let loginPage: LoginPage;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();

  loginPage = new LoginPage(page);
  homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin(page);
  await expect(page).toHaveTitle(/Dashboard/);
});

// Runs once after all tests are done
test.afterAll(async () => {
  await context.close(); // ✅ Close context only once
});

test.describe.serial('Main Navigation Flow', () => {

  test('should click Quotes', async () => {
    await homePage.clickQuotes();
    await expect(page).toHaveURL(/quotes/);
  });

  test('should click Policies', async () => {
    await homePage.clickPolicies();
    await expect(page).toHaveURL(/policies/);
  });

//   test('should click New Quote', async () => {
//     await homePage.clickNewQuote();
//     await expect(page.locator(NEW_QUOTE_SELECTORS.riskLocation)).toBeVisible();
//   });

//   test('should click Risk Location', async () => {
//     await homePage.clickRiskLocation();
//     await expect(page).toHaveURL(/search-risk-location/);
//   });

//   test('should click Coverage', async () => {
//     await homePage.clickCoverage();
//     await expect(page).toHaveURL(/coverage/);
//   });

//   test('should click Quote', async () => {
//     await homePage.clickQuote();
//     await expect(page).toHaveURL(/quote/);
//   });

//   test('should click Bind Policy', async () => {
//     await homePage.clickBindPolicy();
//     await expect(page).toHaveURL(/bind-policy/);
//   });

//   test('should click Issued Policy', async () => {
//     await homePage.clickIssuedPolicy();
//     await expect(page).toHaveURL(/issued-policy/);
//   });
});
