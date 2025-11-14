import { Page, expect } from '@playwright/test';
import BasePage from './base.page';
import { SIDEBAR_BUTTONS_SELECTORS } from '../page-constants/sidebarButtons.constants';

export default class SidebarButtonsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickAlertReports() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.alerReportsButton);
  }

  async clickVesselReports() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.vesselReportsButton);
  }

  async clickValidationList() {
    await this.page.locator(SIDEBAR_BUTTONS_SELECTORS.validationButton).hover();
    await expect(this.page.locator(SIDEBAR_BUTTONS_SELECTORS.validationRulesButton)).toBeVisible();
    await this.click(SIDEBAR_BUTTONS_SELECTORS.validationRulesButton);
  }

  async clickManagePorts() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.managePortsButton);
  }

  async clickUsers() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.usersButton);
  }

  async clickSpireAISGaps() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.spireAISGapsButton);
  }

  async clickFormConfiguration() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.formConfigurationButton);
  }

  async clickInformationManagement() {
    await this.click(SIDEBAR_BUTTONS_SELECTORS.informationManagementButton);
  }
}
