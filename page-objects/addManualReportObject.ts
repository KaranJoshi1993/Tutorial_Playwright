import { Page, expect } from '@playwright/test';
import BasePage from './basePageObject';
import { AddManualReportConstant } from '../page-constants/addManualReportConstatnt';
import testData from '../test-data/addManualReport.json';

export default class AddManualReport extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectFromAntDropdown(dropdownLocator: string, value: string) {
    await this.page.locator(dropdownLocator).click();
    await this.page.keyboard.type(value);

    const option = this.page.getByRole('combobox', {
      name: value,
      exact: true,
    });

    if (await option.isVisible()) {
      await option.click(); // deterministic
    } else {
      await this.page.keyboard.press('Enter'); // fallback
    }
  }

  async clickManualEntryButton() {
    await this.click(AddManualReportConstant.BasicDetails.manualEntryButton);
  }

  async fillBasicDetailsSectionData() {
    await this.selectFromAntDropdown(AddManualReportConstant.BasicDetails.vesselNameDropdown, testData.BasicDetails.vesselName);
    await this.selectFromAntDropdown(AddManualReportConstant.BasicDetails.reportTypeDropdown, testData.BasicDetails.reportType);
    await this.selectFromAntDropdown(AddManualReportConstant.BasicDetails.reportEventDropdown, testData.BasicDetails.reportEvent);
    await this.fill(AddManualReportConstant.BasicDetails.voyageNumberInput, testData.BasicDetails.voyageNumber);
    // await this.selectFromAntDropdown(AddManualReportConstant.BasicDetails.repairReportDropdown, testData.BasicDetails.repairReport);
  }

  async fillLocalDateTime() {
    await this.click(AddManualReportConstant.ReportOverview.localDateTimeInput);
    await this.click(AddManualReportConstant.ReportOverview.specificDate);
    await this.click(AddManualReportConstant.ReportOverview.okButton);
  }

  async fillLocalDateTimeOffset() {
    await this.click(AddManualReportConstant.ReportOverview.localDateTimeOffsetDropdown);
    await this.click(AddManualReportConstant.ReportOverview.specificDateTimeOffset); 
  }

  async fillPositionSectionData() {
    await this.fill(AddManualReportConstant.ReportOverview.latDegreesInput, testData.ReportOverview.latDegrees);
    await this.fill(AddManualReportConstant.ReportOverview.latMinutesInput, testData.ReportOverview.latMinutes);
    await this.fill(AddManualReportConstant.ReportOverview.latSecondsInput, testData.ReportOverview.latSeconds);
    await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.latDirectionDropdown, testData.ReportOverview.latDirection);
    await this.fill(AddManualReportConstant.ReportOverview.lonDegreesInput, testData.ReportOverview.lonDegrees);
    await this.fill(AddManualReportConstant.ReportOverview.lonMinutesInput, testData.ReportOverview.lonMinutes);
    await this.fill(AddManualReportConstant.ReportOverview.lonSecondsInput, testData.ReportOverview.lonSeconds);
    await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.lonDirectionDropdown, testData.ReportOverview.lonDirection);
    await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.headingCardinalDropdown, testData.ReportOverview.headingCardinal);
    await this.fill(AddManualReportConstant.ReportOverview.headingDegreesInput, testData.ReportOverview.headingDegrees);
    await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.courseCardinalDropdown, testData.ReportOverview.courseCardinal);
    await this.fill(AddManualReportConstant.ReportOverview.courseDegreesInput, testData.ReportOverview.courseDegrees);
  }

  async fillPortSectionData() {
    // await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.currentPortDropdown, testData.ReportOverview.currentPort);

    await this.click(AddManualReportConstant.ReportOverview.portETDInput);
    await this.click(AddManualReportConstant.ReportOverview.specificPortETDDate);
    await this.click(AddManualReportConstant.ReportOverview.portOkButton);

    await this.click(AddManualReportConstant.ReportOverview.portETDDateTimeOffsetDropdown);
    await this.click(AddManualReportConstant.ReportOverview.specificPortETDDateTimeOffset); 

    await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.primaryReasonForPortCallDropdown, testData.ReportOverview.primaryReasonForPortCall);
  }

  async fillUpcomingPortSectionData() {
    await this.click(AddManualReportConstant.ReportOverview.portETDInput);
    await this.click(AddManualReportConstant.ReportOverview.specificPortETDDate);
    await this.click(AddManualReportConstant.ReportOverview.portOkButton);

    await this.click(AddManualReportConstant.ReportOverview.portETDDateTimeOffsetDropdown);
    await this.click(AddManualReportConstant.ReportOverview.specificPortETDDateTimeOffset); 

    await this.selectFromAntDropdown(AddManualReportConstant.ReportOverview.primaryReasonForPortCallDropdown, testData.ReportOverview.primaryReasonForPortCall);
  }
}