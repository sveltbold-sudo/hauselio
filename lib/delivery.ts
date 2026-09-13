export function getEstimatedDeliveryDate(): { from: string; to: string; fromISO: string; toISO: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();

  let daysToAddMin = 2;
  let daysToAddMax = 5;

  if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
    daysToAddMin = 3;
    daysToAddMax = 6;
  }

  const fromDate = new Date(now);
  fromDate.setDate(now.getDate() + daysToAddMin);

  const toDate = new Date(now);
  toDate.setDate(now.getDate() + daysToAddMax);

  const formatGerman = (d: Date) => {
    const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`;
  };

  const toISODate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return {
    from: formatGerman(fromDate),
    to: formatGerman(toDate),
    fromISO: toISODate(fromDate),
    toISO: toISODate(toDate),
  };
}

export function getDeliveryEstimateText(): string {
  const { from, to } = getEstimatedDeliveryDate();
  return `Lieferung vom ${from} bis ${to}`;
}
