import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import SidebarButtonsPage from '../page-objects/sidebarButtons.page';
import { LoginPage } from '../page-objects/login.page';
import { email, password } from '../utils/credentials';
import { SIDEBAR_BUTTONS_ASSERTIONS } from '../page-constants/sidebarButtons.constants';
import { LOGIN_PAGE_ASSERTIONS } from '../page-constants/login.constants';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let sidebarButtonsPage: SidebarButtonsPage;
let loginPage: LoginPage;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();

  loginPage = new LoginPage(page);
  sidebarButtonsPage = new SidebarButtonsPage(page);

  await loginPage.navigateTo();
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin(page);
  await expect(page).toHaveURL(LOGIN_PAGE_ASSERTIONS.alertReportsListURL);
});

test.describe.serial('Sidebar Buttons Navigation Flow', () => {

  test('Should click Alert Reports', async () => {
    await sidebarButtonsPage.clickAlertReports();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.alertReportsListURL);
  });

  test('Should click Vessel Reports', async () => {
    await sidebarButtonsPage.clickVesselReports();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.vesselReportsListURL);
  });

  // test('Should click Validation Rules', async () => {
  //   await sidebarButtonsPage.clickValidationList();
  //   await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.validationRulesURL);
  // });

  test('Should click Manage Ports', async () => {
    await sidebarButtonsPage.clickManagePorts();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.managePortsURL);
  });

  test('Should click Users', async () => {
    await sidebarButtonsPage.clickUsers();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.usersURL);
  });

  test('Should click Spire AIS Gaps', async () => {
    await sidebarButtonsPage.clickSpireAISGaps();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.spireAISGapsURL);
  });

  test('Should click Form Configuration', async () => {
    await sidebarButtonsPage.clickFormConfiguration();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.formConfigurationURL);
  });

  test('should click Information Management', async () => {
    await sidebarButtonsPage.clickInformationManagement();
    await expect(page).toHaveURL(SIDEBAR_BUTTONS_ASSERTIONS.informationManagementURL);
  });

});

test.afterAll(async () => {
  await context.close();
});
