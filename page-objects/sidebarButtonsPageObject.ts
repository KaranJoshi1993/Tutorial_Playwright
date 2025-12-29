import { Page, expect } from '@playwright/test';
import BasePage from './basePageObject';
import { SidebarButtonsConstant, SidebarButtonsAssertions } from '../page-constants/sidebarButtonsConstant';


export default class SidebarButtonsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickAlertReports() {
    await this.click(SidebarButtonsConstant.alerReportsButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.alertReportsListURL);
  }

  async clickVesselReports() {
    await this.click(SidebarButtonsConstant.vesselReportsButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.vesselReportsListURL);
  }

  // async clickValidationList() {
  //   await this.page.locator(SidebarButtonsConstant.validationRulesButton).hover();
  //   await expect(this.page.locator(SidebarButtonsConstant.validationListButton)).toBeVisible();
  //   await this.click(SidebarButtonsConstant.validationListButton);
  // }

  async clickValidationList() {
    const menu = this.page.locator(SidebarButtonsConstant.validationRulesButton);
    const subMenu = this.page.locator(SidebarButtonsConstant.validationListButton);

    await menu.waitFor({ state: 'visible' });
    await menu.hover();

    await subMenu.waitFor({ state: 'visible' });
    await subMenu.click({ force: true });
  }

  async clickDefaultValues() {
    const menu = this.page.locator(SidebarButtonsConstant.validationRulesButton);
    const subMenu = this.page.locator(SidebarButtonsConstant.defaultValuesButton);

    await menu.waitFor({ state: 'visible' });
    await menu.hover();

    await subMenu.waitFor({ state: 'visible' });
    await subMenu.click({ force: true });
  }

  async clickManagePorts() {
    await this.click(SidebarButtonsConstant.managePortsButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.managePortsURL);
  }

  async clickUsers() {
    await this.click(SidebarButtonsConstant.usersButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.usersURL);
  }

  async clickSpireAISGaps() {
    await this.click(SidebarButtonsConstant.spireAISGapsButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.spireAISGapsURL);
  }

  async clickFormConfiguration() {
    await this.click(SidebarButtonsConstant.formConfigurationButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.formConfigurationURL);
  }

  async clickInformationManagement() {
    await this.click(SidebarButtonsConstant.informationManagementButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.informationManagementURL);
  }

  async clickHistoricalDataUpload() {
    await this.click(SidebarButtonsConstant.historicalDataUploadButton);
    await expect(this.page).toHaveURL(SidebarButtonsAssertions.historicalDataUploadURL);
  }
}
