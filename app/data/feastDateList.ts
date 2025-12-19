const year = new Date().getFullYear();

const getFeastOfHarvest = () => {
  let date = new Date(`${year}-01-15`);

  // Find the first Saturday after Jan 15
  while (date.getDay() !== 6) {
    // 6 = Saturday
    date.setDate(date.getDate() + 1);
  }

  // Add 7 more Saturdays
  date.setDate(date.getDate() + 7 * 7);

  // Move to the next day (Sunday)
  date.setDate(date.getDate() + 1);

  return date.toISOString().split("T")[0]; // Returns ISO format (YYYY-MM-DD)
};

const banalNaPagtitipon = () => {
  let date = new Date(`${year}-07-15`);

  // Add 8 days
  date.setDate(date.getDate() + 8);

  return date.toISOString().split("T")[0]; // Returns ISO format (YYYY-MM-DD)
};

export const feast = [
  {
    name: "Feast of Passover",
    date: new Date(`${year}-01-14`),
    dateSting: `${year}-01-14`,
  },
  {
    name: "Feast of Unleavened bread",
    date: new Date(`${year}-01-15`),
    dateSting: `${year}-01-15`,
  },
  {
    name: "Feast of Harvest",
    date: new Date(getFeastOfHarvest()),
    dateSting: getFeastOfHarvest(),
  },
  {
    name: "Feast of Weeks",
    date: new Date(getFeastOfHarvest()),
    dateSting: getFeastOfHarvest(),
  },
  {
    name: "Feast of Trumpets",
    date: new Date(`${year}-07-01`),
    dateSting: `${year}-07-01`,
  },
  //July 9-10
  {
    name: "Day of atonement",
    dateFrom: new Date(`${year}-07-09`),
    dateTo: new Date(`${year}-07-10`),
    dateStringFrom: `${year}-07-09`,
    dateStringTo: `${year}-07-10`,
  },
  {
    name: "Feast of Tabernacles",
    date: new Date(`${year}-07-15`),
    dateSting: `${year}-07-09`,
  },
  {
    name: "Banal na pagtitipon",
    date: new Date(banalNaPagtitipon()),
    dateSting: banalNaPagtitipon(),
  },
];

// Feast of passover Jan 14
// Jan 14 + 1day = feast of unleavened
// Jan 14 + 7days + 7 shabbath + 1 day = feast of weeks
// July 1 = feast of trumpets
// July 9-10 = Day of Atonement
// July 15 = feast of tabernacles
// July 15 + 8days = banal na pag titipon
