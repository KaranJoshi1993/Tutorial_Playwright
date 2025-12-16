import { Page, expect } from '@playwright/test';
import BasePage from './basePageObject';
import { SidebarButtonsConstant } from '../page-constants/sidebarButtonsConstant';

export default class SidebarButtonsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickAlertReports() {
    await this.click(SidebarButtonsConstant.alerReportsButton);
  }

  async clickVesselReports() {
    await this.click(SidebarButtonsConstant.vesselReportsButton);
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
  }

  async clickUsers() {
    await this.click(SidebarButtonsConstant.usersButton);
  }

  async clickSpireAISGaps() {
    await this.click(SidebarButtonsConstant.spireAISGapsButton);
  }

  async clickFormConfiguration() {
    await this.click(SidebarButtonsConstant.formConfigurationButton);
  }

  async clickInformationManagement() {
    await this.click(SidebarButtonsConstant.informationManagementButton);
  }

  async clickHistoricalDataUpload() {
    await this.click(SidebarButtonsConstant.historicalDataUploadButton);
  }
}
