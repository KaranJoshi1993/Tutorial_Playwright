export const SidebarButtonsConstant = {
  alerReportsButton: "//span[text()='Alert Reports']",
  vesselReportsButton: "//span[text()='Vessel Reports (Raw)']",

  validationRulesButton: "li[link='/validation-rules']",
  validationListButton: "//span[text()='Validation List']",
  defaultValuesButton: "//span[text()='Default Values']",
  validationRuleReportButton: "//span[text()='Validation Rule Report']",
  serviceNotificationsButton: "//span[text()='Service Notifications']",

  managePortsButton: "//span[text()='Manage Ports']",
  usersButton: "//span[text()='Users']",
  spireAISGapsButton: "//span[text()='Spire AIS Gaps']",
  formConfigurationButton: "//span[text()='Form Configuration']",
  informationManagementButton: "//span[text()='Information Management']",
  historicalDataUploadButton: "//span[text()='Historical Data Upload']"
};

export const SidebarButtonsAssertions = {
  alertReportsListURL: "/alert/reports",
  vesselReportsListURL: "/vessel-reports",

  validationURL: "/validation-rules/validation",
  defaultValuesURL: "/validation-rules/default-values",
  validationRuleReportURL: "/validation-rules/rule-report",
  serviceNotificationsURL: "/validation-rules/service-notification",
  
  managePortsURL: "/ports",
  usersURL: "/users",
  spireAISGapsURL: "/spire-ais-gaps",
  formConfigurationURL: "/form-configuration",
  informationManagementURL: "/information-management",
  historicalDataUploadURL: "/historical-Data-Upload"
};