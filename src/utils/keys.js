const keys = {
  // Production
  // server: "http://115.186.183.129:37000",

  // Staging
  server: "http://115.186.183.129:27000",

  showMockData: false,
  showDashboardSummaryCards: true,
  showDashboardSummaryHeaders: false,

  minimalMachineSummaryCards: true,

  featureTemporarilyUnavailable: false,

  users: [
    {
      name: "default",
      password: "default",
      workshopID: "default",
      navigationAliases: ["default", "default"],
      type: "default",
    },
    {
      name: "shifa",
      password: "1234",
      workshopID: "5fecdd5a7221a50e7842198b",
      navigationAliases: ["workshops", "zones"],
      type: "user",
    },
    {
      name: "gsk",
      password: "1234",
      workshopID: "600fabc8549c501670d98806",
      navigationAliases: ["workshops", "zones"],
      type: "user",
    },
    {
      name: "kolson",
      password: "1234",
      workshopID: "",
      navigationAliases: ["workshops", "zones"],
      type: "user",
    },
    {
      name: "demo",
      password: "demo",
      workshopID: "",
      navigationAliases: ["workshops", "zones"],
      type: "user",
    },
    {
      name: "ihsan-safety",
      password: "1234",
      workshopID: "6011407db9c4963230840521",
      navigationAliases: ["workshops", "zones"],
      type: "user",
    },
    {
      name: "admin",
      password: "12345678",
      workshopID: "",
      navigationAliases: ["workshops", "zones"],
      type: "admin",
    },
    {
      name: "karachi-steel",
      password: "1234",
      workshopID: "603c8b590f2dc628d8e1a6e9",
      navigationAliases: ["workshops", "zones"],
      type: "user",
    },
  ],
};

export default keys;
