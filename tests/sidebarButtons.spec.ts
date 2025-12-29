import { test } from '../fixtures/fixtures';
import SidebarButtonsPage from '../page-objects/sidebarButtonsPageObject';

test.describe.serial('Sidebar Buttons Navigation Flow', () => {

  test('Should click Sidebar Buttons', async ({ page }) => {
    const sidebar = new SidebarButtonsPage(page);
    await sidebar.clickAlertReports();
    await sidebar.clickVesselReports();
    await sidebar.clickManagePorts();
    await sidebar.clickUsers();
    await sidebar.clickSpireAISGaps();
    await sidebar.clickFormConfiguration();
    await sidebar.clickInformationManagement();
    await sidebar.clickHistoricalDataUpload();
  });

});
