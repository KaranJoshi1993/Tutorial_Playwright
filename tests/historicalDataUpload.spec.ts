import { test } from '../fixtures/fixtures';
import SidebarButtonsPage from '../page-objects/sidebarButtonsPageObject';
import HistoricDataUpload from '../page-objects/historicDataUploadObject';

test.describe.serial('Upload Excel Files', () => {

  test('Upload Excel Files', async ({ page }) => {
    const sidebarButtonsPage = new SidebarButtonsPage(page);
    const historicDataUpload = new HistoricDataUpload(page);
    await sidebarButtonsPage.clickHistoricalDataUpload();
    await historicDataUpload.clickToSelectFilesButton();
    await historicDataUpload.verifyUploadedFiles();
    await historicDataUpload.clickUploadButton();
    await page.waitForTimeout(3000); // Wait for 3 seconds to observe the upload action

  });

});
