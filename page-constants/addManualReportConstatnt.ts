export const AddManualReportConstant = {
  
  BasicDetails: {
    manualEntryButton: "//span[text()='Manual Entry']",
    vesselNameDropdown: "input[id='vesselImo']",
    reportTypeDropdown: "input[id='reportType']",
    reportEventDropdown: "input[id='reportEvent']",
    voyageNumberInput: "input[placeholder='Voyage Number']",
    repairReportDropdown: "input[id='isRepairReport']"
  },

  ReportOverview: {
    localDateTimeInput: "input[id='localDateTimeString']",
    nowDateTime: "//a[text()='Now']",
    specificDate: "td[title='2025-12-01']",
    okButton: "//li[@class='ant-picker-ok'] //button[@type='button']",
    localDateTimeOffsetDropdown: "input[id='localDateTimeStringOffset']",
    specificDateTimeOffset: "//div[text()='UTC+04:00']",
    latDegreesInput: "input[id='lattitude_degrees']",
    latMinutesInput: "input[id='lattitude_minutes']",
    latSecondsInput: "input[id='lattitude_seconds']",
    latDirectionDropdown: "input[id='lattitude_direction']",
    lonDegreesInput: "input[id='longitude_degrees']",
    lonMinutesInput: "input[id='longitude_minutes']",
    lonSecondsInput: "input[id='longitude_seconds']",
    lonDirectionDropdown: "input[id='longitude_direction']",
    headingCardinalDropdown: "input[id='reportedHeadingCardinal']",
    headingDegreesInput: "input[id='reportedHeadingDegrees']",
    courseCardinalDropdown: "input[id='reportedCourseCardinal']",
    courseDegreesInput: "input[id='reportedCourseDegrees']",
    currentPortDropdown: "input[id='port']",
    portETDInput: "input[id='portEtd']",
    specificPortETDDate: "//div[@class='ant-picker-dropdown css-13e2l7p ant-picker-dropdown-placement-topLeft'] //td[@title='2025-12-05']",
    portOkButton: "//div[@class='ant-picker-dropdown css-13e2l7p ant-picker-dropdown-placement-topLeft'] //li[@class='ant-picker-ok'] //button[@type='button']",
    portETDDateTimeOffsetDropdown: "input[id='portEtdutcOffset']",
    specificPortETDDateTimeOffset: "//div[text()='UTC-12:00']",
    primaryReasonForPortCallDropdown: "input[id='reportedPrimaryReasonForPortCall']",
    upcomingPort1Dropdown: "input[id='upcomingPorts_0_portName']",
    upcomingPort1ViaDropdown: "input[id='upcomingPorts_0_via']",
    upcomingPort1ETAInput: "input[id='upcomingPorts_0_portEta']",
    upcomingPort1ETAOffsetDropdown: "input[id='upcomingPorts_0_portEtaUTCOffset']",
    upcomingPort1DistanceToGoInput: "input[id='upcomingPorts_0_distToGo']",
    upcomingPortAddField: "//span[text()='Add field']",
    endangeredNavigationDropdown: "input[id='reportedEndangerSafetyOfNavigation']",
    reasonForEndangeringSafetyOfNavigationDropdown: "input[id='reportedReasonforSafetyOfNavigation']",
    sailingInIceConditionsDropdown: "input[id='reportedIceConditions']",
    estArrivalDraftForeInput: "input[id='estFwdDraft']",
    estArrivalDraftAftInput: "input[id='estAftDraft']",
    estArrivalSwBwFwDropdown: "input[id='swbwfwEst']",
    berthSTSVesselNameInput: "input[id='berth_STS_VesselName']",
    reasonForBerthCallDropdown: "input[id='reasonForBerthCall']",
    cargoOperationDropdown: "input[id='reportedCargoOperation']",
    berthOrSTSDropdown: "input[id='stsVessel']",
    stsLocationDropdown: "input[id='stsLocation']",
    lastDeparturePortDropdown: "input[id='reportedLastPort']",
    distanceSinceDepartureInput: "input[id='reportedDistanceSinceDepartureNm']"
  }
};

export const AddManualReportAssertion = {
  manualEntryPageURL: "/vessel-reports/new",
  microsoft: "Sign in with Microsoft",
};