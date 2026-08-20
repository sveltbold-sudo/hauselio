export function getEstimatedDeliveryDate(): { from: string; to: string } {
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

  return {
    from: formatGerman(fromDate),
    to: formatGerman(toDate),
  };
}

export function getDeliveryEstimateText(): string {
  const { from, to } = getEstimatedDeliveryDate();
  return `Lieferung vom ${from} bis ${to}`;
}
