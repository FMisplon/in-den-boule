const HOURS_BY_WEEKDAY: Record<number, string[]> = {
  0: buildHourlySlots(20, 3),
  1: buildHourlySlots(11, 3),
  2: buildHourlySlots(11, 3),
  3: buildHourlySlots(11, 3),
  4: buildHourlySlots(11, 3),
  5: [],
  6: []
};

function buildHourlySlots(startHour: number, endHourExclusive: number) {
  const slots: string[] = [];
  let hour = startHour;

  while (hour !== endHourExclusive) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    hour = (hour + 1) % 24;
  }

  return slots;
}

export function getWeekdayFromDate(dateValue: string) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(`${dateValue}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getDay();
}

export function getReservationHoursForDate(dateValue: string) {
  const weekday = getWeekdayFromDate(dateValue);

  if (weekday === null) {
    return [];
  }

  return HOURS_BY_WEEKDAY[weekday] || [];
}

export function isReservationDateAllowed(dateValue: string) {
  return getReservationHoursForDate(dateValue).length > 0;
}

export function isReservationTimeAllowed(dateValue: string, timeValue: string) {
  return getReservationHoursForDate(dateValue).includes(timeValue);
}

export function getReservationDisabledWeekdays() {
  return Object.entries(HOURS_BY_WEEKDAY)
    .filter(([, hours]) => hours.length === 0)
    .map(([weekday]) => Number(weekday));
}

export function getReservationDefaultDate() {
  const cursor = new Date();

  for (let index = 0; index < 14; index += 1) {
    const candidate = new Date(cursor);
    candidate.setDate(cursor.getDate() + index);
    const dateValue = candidate.toISOString().slice(0, 10);

    if (isReservationDateAllowed(dateValue)) {
      return dateValue;
    }
  }

  return cursor.toISOString().slice(0, 10);
}

export function getReservationDefaultTime(dateValue: string) {
  return getReservationHoursForDate(dateValue)[0] || "19:00";
}
