import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPageObject } from '../page-objects/loginPageObject';
import { email, password } from '../utils/credentials';
import { LoginPageAssertion } from '../page-constants/loginPageConstant';
import SidebarButtonsPage from '../page-objects/sidebarButtonsPageObject';
import AddManualReport from '../page-objects/addManualReportObject';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPageObject: LoginPageObject;
let sidebarButtonsPage: SidebarButtonsPage;
let addManualReport: AddManualReport;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();
  loginPageObject = new LoginPageObject(page, context);
  sidebarButtonsPage = new SidebarButtonsPage(page);
  addManualReport = new AddManualReport(page);

  await loginPageObject.navigateTo();
  await loginPageObject.enterEmail(email);
  await loginPageObject.enterPassword(password);
  await loginPageObject.clickLogin(page);
  await expect(page).toHaveURL(LoginPageAssertion.alertReportsListURL);
});

test.describe.serial('Add Arrival Report Manually', () => {

  test('Should fill Basic Details', async () => {
    await sidebarButtonsPage.clickVesselReports();
    await addManualReport.clickManualEntryButton();
    await addManualReport.fillVesselName();
    await addManualReport.fillReportType();
    await addManualReport.fillReportEvent();
    await addManualReport.fillVoyageNumber();
    await addManualReport.fillRepairReport();
    await addManualReport.fillLocalDateTime();
    await addManualReport.fillLocalDateTimeOffset();

  });

});

// test.afterAll(async () => {
//   await context.close();
// });
