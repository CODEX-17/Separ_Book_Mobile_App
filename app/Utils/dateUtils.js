export const convertDateFormatIntoString = (date) => {
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
