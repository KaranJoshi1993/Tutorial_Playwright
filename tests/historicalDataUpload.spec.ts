import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPageObject } from '../page-objects/loginPageObject';
import { email, password } from '../utils/credentials';
import { LoginPageAssertion } from '../page-constants/loginPageConstant';
import SidebarButtonsPage from '../page-objects/sidebarButtonsPageObject';
import HistoricDataUpload from '../page-objects/historicDataUploadObject';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPageObject: LoginPageObject;
let sidebarButtonsPage: SidebarButtonsPage;
let historicDataUpload: HistoricDataUpload;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();
  loginPageObject = new LoginPageObject(page, context);
  sidebarButtonsPage = new SidebarButtonsPage(page);
  historicDataUpload = new HistoricDataUpload(page);

  await loginPageObject.navigateTo();
  await loginPageObject.enterEmail(email);
  await loginPageObject.enterPassword(password);
  await loginPageObject.clickLogin(page);
  await expect(page).toHaveURL(LoginPageAssertion.alertReportsListURL);
});

test.describe.serial('Upload Excel Files', () => {

  test('Upload Excel Files', async () => {
    await sidebarButtonsPage.clickHistoricalDataUpload();
    await historicDataUpload.clickToSelectFilesButton();
    await historicDataUpload.verifyUploadedFiles();
    await historicDataUpload.clickUploadButton();
    await page.waitForTimeout(3000); // Wait for 3 seconds to observe the upload action

  });

});
