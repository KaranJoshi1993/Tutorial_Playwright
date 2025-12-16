import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import SidebarButtonsPage from '../page-objects/sidebarButtonsPageObject';
import { LoginPageObject } from '../page-objects/loginPageObject';
import { email, password } from '../utils/credentials';
import { SidebarButtonsAssertions } from '../page-constants/sidebarButtonsConstant';
import { LoginPageAssertion } from '../page-constants/loginPageConstant';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let sidebarButtonsPage: SidebarButtonsPage;
let loginPageObject: LoginPageObject;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();

  loginPageObject = new LoginPageObject(page, context);
  sidebarButtonsPage = new SidebarButtonsPage(page);

  await loginPageObject.navigateTo();
  await loginPageObject.enterEmail(email);
  await loginPageObject.enterPassword(password);
  await loginPageObject.clickLogin(page);
  await expect(page).toHaveURL(LoginPageAssertion.alertReportsListURL);
});

test.describe.serial('Sidebar Buttons Navigation Flow', () => {

  test('Should click Alert Reports', async () => {
    await sidebarButtonsPage.clickAlertReports();
    await expect(page).toHaveURL(SidebarButtonsAssertions.alertReportsListURL);
  });

  test('Should click Vessel Reports', async () => {
    await sidebarButtonsPage.clickVesselReports();
    await expect(page).toHaveURL(SidebarButtonsAssertions.vesselReportsListURL);
  });

  test('Should click Validation Rules', async () => {
    await sidebarButtonsPage.clickValidationList();
    await expect(page).toHaveURL(SidebarButtonsAssertions.validationURL);
  });

  // test('Should click Default Values', async () => {
  //   await sidebarButtonsPage.clickDefaultValues();
  //   await expect(page).toHaveURL(SidebarButtonsAssertions.defaultValuesURL);
  // });

  test('Should click Manage Ports', async () => {
    await sidebarButtonsPage.clickManagePorts();
    await expect(page).toHaveURL(SidebarButtonsAssertions.managePortsURL);
  });

  test('Should click Users', async () => {
    await sidebarButtonsPage.clickUsers();
    await expect(page).toHaveURL(SidebarButtonsAssertions.usersURL);
  });

  test('Should click Spire AIS Gaps', async () => {
    await sidebarButtonsPage.clickSpireAISGaps();
    await expect(page).toHaveURL(SidebarButtonsAssertions.spireAISGapsURL);
  });

  test('Should click Form Configuration', async () => {
    await sidebarButtonsPage.clickFormConfiguration();
    await expect(page).toHaveURL(SidebarButtonsAssertions.formConfigurationURL);
  });

  test('should click Information Management', async () => {
    await sidebarButtonsPage.clickInformationManagement();
    await expect(page).toHaveURL(SidebarButtonsAssertions.informationManagementURL);
  });

  test('should click Historical Data Upload', async () => {
    await sidebarButtonsPage.clickHistoricalDataUpload();
    await expect(page).toHaveURL(SidebarButtonsAssertions.historicalDataUploadURL);
  });

});

test.afterAll(async () => {
  await context.close();
});
