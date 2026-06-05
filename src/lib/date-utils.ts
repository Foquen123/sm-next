export function getCurrentDayIndex(): number {
  const today = new Date();
  const dayIndex = today.getDay();
  return dayIndex === 0 ? 0 : dayIndex - 1;
}
