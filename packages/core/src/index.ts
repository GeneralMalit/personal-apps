export function formatTimestamp(date: Date = new Date()): string {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const meridiem = hours24 >= 12 ? "PM" : "AM";

  return `${hours12}:${minutes}:${seconds}${meridiem}`;
}

export function formatCurrentTimestamp(): string {
  return formatTimestamp(new Date());
}
