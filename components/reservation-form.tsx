"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { submitReservation } from "@/app/actions/inquiries";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";
import { idleFormState } from "@/lib/forms";
import {
  getReservationDefaultDate,
  getReservationDefaultTime,
  getReservationDisabledWeekdays,
  getReservationHoursForDate,
  isReservationDateAllowed
} from "@/lib/reservations";

export function ReservationForm() {
  const [state, formAction] = useActionState(submitReservation, idleFormState);
  const [reservationDate, setReservationDate] = useState(getReservationDefaultDate());
  const disabledWeekdays = useMemo(() => new Set(getReservationDisabledWeekdays()), []);
  const availableHours = useMemo(
    () => getReservationHoursForDate(reservationDate),
    [reservationDate]
  );
  const [reservationTime, setReservationTime] = useState(getReservationDefaultTime(reservationDate));

  useEffect(() => {
    if (reservationTime && availableHours.includes(reservationTime)) {
      return;
    }

    if (availableHours[0]) {
      setReservationTime(availableHours[0]);
    }
  }, [availableHours, reservationTime]);

  function handleDateChange(nextDate: string) {
    setReservationDate(nextDate);
    setReservationTime(getReservationDefaultTime(nextDate));
  }

  function handleDateInputBlur(nextDate: string) {
    if (!nextDate || isReservationDateAllowed(nextDate)) {
      return;
    }

    const fallbackDate = getReservationDefaultDate();
    setReservationDate(fallbackDate);
    setReservationTime(getReservationDefaultTime(fallbackDate));
  }

  return (
    <form className="reservation-form" action={formAction}>
      <label>
        Datum
        <input
          name="reservation_date"
          type="date"
          value={reservationDate}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => handleDateChange(event.target.value)}
          onBlur={(event) => handleDateInputBlur(event.target.value)}
        />
      </label>
      <p className="field-hint">Reservaties zijn mogelijk op zondag en maandag tot donderdag.</p>
      <label>
        Uur
        <select
          name="reservation_time"
          value={reservationTime}
          onChange={(event) => setReservationTime(event.target.value)}
        >
          {availableHours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
      </label>
      <div className="reservation-availability">
        {["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"].map(
          (day, index) => (
            <span
              key={day}
              className={disabledWeekdays.has(index) ? "availability-pill is-closed" : "availability-pill"}
            >
              {day}
            </span>
          )
        )}
      </div>
      <label>
        Aantal gasten
        <select name="party_size" defaultValue="2 personen">
          <option>2 personen</option>
          <option>4 personen</option>
          <option>6 personen</option>
          <option>8+ personen</option>
        </select>
      </label>
      <label>
        Naam
        <input name="name" type="text" placeholder="Jouw naam" />
      </label>
      <label>
        E-mail
        <input name="email" type="email" placeholder="naam@email.be" />
      </label>
      <label>
        Opmerking
        <textarea name="note" rows={4} placeholder="Verjaardag, allergie, grotere groep, ..." />
      </label>
      <SubmitButton>Verstuur aanvraag</SubmitButton>
      <FormFeedback state={state} />
    </form>
  );
}
