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

//This feast is for 2026 only
export const feast = [
  {
    name: "Feast of Passover",
    date: new Date(`2026-02-01`),
    dateSting: `2026-02-01`,
  },
  {
    name: "Feast of Unleavened bread",
    date: new Date(`2026-02-02`),
    dateSting: `2026-02-02`,
  },
  {
    name: "Feast of Harvest",
    date: new Date(`2026-03-29`),
    dateSting: `2026-03-29`,
  },
  {
    name: "Feast of Weeks",
    date: new Date(`2026-03-29`),
    dateSting: `2026-03-29`,
  },
  {
    name: "Feast of Trumpets",
    date: new Date(`2026-07-14`),
    dateSting: `2026-07-14`,
  },
  {
    name: "Day of atonement",
    dateFrom: new Date(`2026-07-24`),
    dateTo: new Date(`2026-07-25`),
    dateStringFrom: `2026-07-24`,
    dateStringTo: `2026-07-25`,
  },
  {
    name: "Feast of Tabernacles",
    date: new Date(`2026-07-29`),
    dateSting: `2026-07-29`,
  },
  {
    name: "Banal na pagtitipon",
    date: new Date(`2026-08-07`),
    dateSting: `2026-08-07`,
  },
];

// Feast of passover Jan 14
// Jan 14 + 1day = feast of unleavened
// Jan 14 + 7days + 7 shabbath + 1 day = feast of weeks
// July 1 = feast of trumpets 
// July 9-10 = Day of Atonement
// July 15 = feast of tabernacles
// July 15 + 8days = banal na pag titipon
