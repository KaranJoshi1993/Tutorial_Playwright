import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { email, password, wrongemail, wrongpassword } from '../utils/credentials';
import { LOGIN_PAGE_SELECTORS, LOGIN_PAGE_ASSERTIONS } from '../page-constants/login.constants';

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

test.describe('Login Test Cases', () => {

  test('Should login successfully with valid credentials', async () => {
    await loginPage.navigateTo();
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.clickLogin(page);
    await expect(page).toHaveURL(LOGIN_PAGE_ASSERTIONS.alertReportsListURL);
  });

  test('Should show error for invalid email format', async () => {
    await loginPage.navigateTo();
    await loginPage.enterEmail(wrongemail);
    await loginPage.enterPassword(password);
    await loginPage.clickLogin(page);

    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toBeVisible();
    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toContainText(LOGIN_PAGE_ASSERTIONS.microsoft);
  });

  test('Should show error for incorrect password', async () => {
    await loginPage.navigateTo();
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(wrongpassword);
    await loginPage.clickLogin(page);

    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toBeVisible();
    await expect(page.locator(LOGIN_PAGE_SELECTORS.errorMessage)).toContainText(LOGIN_PAGE_ASSERTIONS.microsoft);
  });

  test('Should show validation for empty email and password', async () => {
    await loginPage.navigateTo();
    await loginPage.clickLogin(page);

    await expect(page.locator(LOGIN_PAGE_SELECTORS.emailError)).toBeVisible();
    await expect(page.locator(LOGIN_PAGE_SELECTORS.passwordError)).toBeVisible();
  });
  
});

test.afterAll(async () => {
  await context.close();
});
