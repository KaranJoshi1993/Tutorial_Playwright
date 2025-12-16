import { Page, expect } from '@playwright/test';
import BasePage from './basePageObject';
import { AddManualReportConstant } from '../page-constants/addManualReportConstatnt';
import testData from '../test-data/addManualReport.json';

export default class AddManualReport extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickManualEntryButton() {
    await this.click(AddManualReportConstant.BasicDetails.manualEntryButton);
  }

  async fillVesselName() {
    await this.click(AddManualReportConstant.BasicDetails.vesselNameDropdown)
    await this.fill(AddManualReportConstant.BasicDetails.vesselNameDropdown, testData.BasicDetails.vesselName);
    await this.page.keyboard.press('Enter');
  }

  async fillReportType() {
    await this.fill(AddManualReportConstant.BasicDetails.reportTypeDropdown, testData.BasicDetails.reportType);
    await this.page.keyboard.press('Enter');
  }

  async fillReportEvent() {
    await this.fill(AddManualReportConstant.BasicDetails.reportEventDropdown, testData.BasicDetails.reportEvent);
    await this.page.keyboard.press('Enter');
  }

  async fillVoyageNumber() {
    await this.fill(AddManualReportConstant.BasicDetails.voyageNumberInput, testData.BasicDetails.voyageNumber);
  }

  async fillRepairReport() {
    await this.fill(AddManualReportConstant.BasicDetails.repairReportDropdown, testData.BasicDetails.repairReport);
    await this.page.keyboard.press('Enter');
  }

  async fillLocalDateTime() {
    await this.click(AddManualReportConstant.ReportOverview.localDateTimeInput);
    await this.click(AddManualReportConstant.ReportOverview.nowDateTime);
  }

  async fillLocalDateTimeOffset() {
    await this.click(AddManualReportConstant.ReportOverview.localDateTimeOffsetDropdown);
    await this.click(AddManualReportConstant.ReportOverview.specificDateTimeOffset); 
  }
}
