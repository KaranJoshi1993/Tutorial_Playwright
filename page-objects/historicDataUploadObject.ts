import { Page, expect } from '@playwright/test';
import BasePage from './basePageObject';
import { HistoricDataUploadConstant, HistoricDataUploadAssertion } from '../page-constants/historicDataUploadConstant';


export default class HistoricDataUpload extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickToSelectFilesButton() {
    const fileInput = this.page.locator(HistoricDataUploadConstant.selectExcelFiles);
    await fileInput.setInputFiles('test-data/files/ShipWatch LPG_1.xlsx');
    await fileInput.setInputFiles('test-data/files/ShipWatch LPG_2.xlsx');
    await fileInput.setInputFiles('test-data/files/ShipWatch LPG_3.xlsx');
  }

  async verifyUploadedFiles() {
    const uploadedFiles = this.page.locator(HistoricDataUploadAssertion.uploadedExcelFiles);
    await expect(uploadedFiles).toHaveCount(3);
    await expect(uploadedFiles).toContainText([
    'ShipWatch LPG_1.xlsx',
    'ShipWatch LPG_2.xlsx',
    'ShipWatch LPG_3.xlsx'
    ]);
  }

  async clickUploadButton() {
    await this.page.click(HistoricDataUploadConstant.uploadButton);
  }
}