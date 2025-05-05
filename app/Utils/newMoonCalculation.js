export const newMoon = () => {
  const convertDateFormatIntoString = (date) => {
    if (!date) return;

    const finalDate = date.substring(0, 10);

    if (finalDate) {
      if (finalDate.includes("-")) {
        let [year, month, day] = finalDate.split("-");
        month =
          ((month === "1" || month === "01") && "Jan") ||
          ((month === "2" || month === "02") && "Feb") ||
          ((month === "3" || month === "03") && "Mar") ||
          ((month === "4" || month === "04") && "Apr") ||
          ((month === "5" || month === "05") && "May") ||
          ((month === "6" || month === "06") && "Jun") ||
          ((month === "7" || month === "07") && "Jul") ||
          ((month === "8" || month === "08") && "Aug") ||
          ((month === "9" || month === "09") && "Sep") ||
          (month === "10" && "Oct") ||
          (month === "11" && "Nov") ||
          (month === "12" && "Dec");

        return `${month}. ${day}, ${year}`;
      } else if (finalDate.includes("/")) {
        let [month, day, year] = finalDate.split("/");
        month =
          (month === "1" && "Jan") ||
          (month === "2" && "Feb") ||
          (month === "3" && "Mar") ||
          (month === "4" && "Apr") ||
          (month === "5" && "May") ||
          (month === "6" && "Jun") ||
          (month === "7" && "Jul") ||
          (month === "8" && "Aug") ||
          (month === "9" && "Sep") ||
          (month === "10" && "Oct") ||
          (month === "11" && "Nov") ||
          (month === "12" && "Dec");

        return `${month}. ${day}, 20${year}`;
      }
    }

    return null;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10) % 24;
    let minute = parseInt(minutes, 10);
    let period = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12; // Convert 24-hour to 12-hour format
    return `${hour}:${minute.toString().padStart(2, "0")}${period}`;
  };

  const year = new Date().getFullYear();
  const newMoons = [];

  // Base new moon date (known reference: January 6, 2000, 18:14 UTC)
  const baseDate = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const synodicMonth = 29.530588853; // Average length of a lunar month in days

  let currentNewMoon = baseDate.getTime();

  // Find the first new moon of the given year
  while (new Date(currentNewMoon).getUTCFullYear() < year) {
    currentNewMoon += synodicMonth * 86400000; // Convert days to milliseconds
  }

  // Collect new moon dates for each month
  for (let month = 0; month < 12; month++) {
    const newMoonDate = new Date(currentNewMoon);
    if (newMoonDate.getUTCFullYear() > year) break;

    newMoons.push(newMoonDate.toISOString()); // Includes both date and time
    currentNewMoon += synodicMonth * 86400000;
  }

  let finalOutput = [];

  for (let i = 0; i < newMoons.length; i++) {
    const currentDate = newMoons[i].substring(0, 13);
    const currentTime = newMoons[i].substring(14, 23);

    finalOutput.push({
      date: convertDateFormatIntoString(currentDate),
      time: formatTime(currentTime),
    });
  }

  return finalOutput;
};
