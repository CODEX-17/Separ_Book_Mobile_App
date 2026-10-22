export const convertDateFormatIntoString = (date) => {
  if (!date) return;

  const finalDate = date.substring(0, 10);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year;
  let month;
  let day;

  if (finalDate.includes("-")) {
    [year, month, day] = finalDate.split("-");
  } else if (finalDate.includes("/")) {
    [month, day, year] = finalDate.split("/");
    if (year.length === 2) year = `20${year}`;
  } else {
    return null;
  }

  const monthName = monthNames[Number(month) - 1];
  if (!monthName || !day || !year) return null;

  return `${monthName}. ${day}, ${year}`;
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  let hour = parseInt(hours, 10) % 24;
  let minute = parseInt(minutes, 10);
  let period = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12; // Convert 24-hour to 12-hour format
  return `${hour}:${minute.toString().padStart(2, "0")}${period}`;
};

export const getSaturdayDay = () => {
  //✅ Returns the date of the next Saturday
  //✅ If today is Saturday, it returns today

  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 6 = Saturday

  const daysUntilSaturday = (6 - day + 7) % 7;

  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);

  return saturday.getDate(); // ✅ single number
};
