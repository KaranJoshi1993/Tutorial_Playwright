import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { email, password, wrongemail, wrongpassword } from '../utils/credentials';
import { LOGIN_PAGE_SELECTORS } from '../locators/locators';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
});

test.afterAll(async () => {
  await context.close();
});

test.describe('Login Test Cases', () => {

  test('✅ Should login successfully with valid credentials', async () => {
    await loginPage.goto();
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.clickLogin(page);
    await expect(page).toHaveTitle(/Dashboard/);
  });

  test('❌ Should show error for invalid email format', async () => {
    await loginPage.goto();
    await loginPage.enterEmail(wrongemail);
    await loginPage.enterPassword(password);
    await loginPage.clickLogin(page);

    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toBeVisible();
    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toContainText(/Email or Password is invalid./);
  });

  test('❌ Should show error for incorrect password', async () => {
    await loginPage.goto();
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(wrongpassword);
    await loginPage.clickLogin(page);

    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toBeVisible();
    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toContainText(/Email or Password is invalid./);
  });

  test('❌ Should show validation for empty email and password', async () => {
    await loginPage.goto();
    await loginPage.clickLogin(page);

    await expect(page.locator(LOGIN_PAGE_SELECTORS.emailError)).toBeVisible();
    await expect(page.locator(LOGIN_PAGE_SELECTORS.passwordError)).toBeVisible();
  });

});