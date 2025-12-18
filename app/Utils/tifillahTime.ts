const isTefillahTime = () => {
  const now = new Date();
  const hours = now.getHours(); // 0–23
  const minutes = now.getMinutes();

  const currentMinutes = hours * 60 + minutes;

  const morningStart = 7 * 60; // 7:00 AM
  const morningEnd = 8 * 60; // 8:00 AM

  const eveningStart = 19 * 60; // 7:00 PM
  const eveningEnd = 20 * 60; // 8:00 PM

  return (
    (currentMinutes >= morningStart && currentMinutes < morningEnd) ||
    (currentMinutes >= eveningStart && currentMinutes < eveningEnd)
  );
};
export default isTefillahTime;
