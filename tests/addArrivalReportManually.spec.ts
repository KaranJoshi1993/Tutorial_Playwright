import { test } from '../fixtures/fixtures';
import SidebarButtonsPage from '../page-objects/sidebarButtonsPageObject';
import AddManualReport from '../page-objects/addManualReportObject';

test.describe.serial('Add a Report Manually', () => {

  test('Should fill details of an Arrival report', async ({page}) => {
    const sidebar = new SidebarButtonsPage(page);
    const addManualReport = new AddManualReport(page);
    await sidebar.clickVesselReports();
    await addManualReport.clickManualEntryButton();
    await addManualReport.fillBasicDetailsSectionData();
    await addManualReport.fillLocalDateTime();
    await addManualReport.fillPositionSectionData();
    await addManualReport.fillPortSectionData();
    await page.waitForTimeout(50000);

  });

});

// test.afterAll(async () => {
//   await context.close();
// });
