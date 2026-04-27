"use client";

import { useActionState, useEffect, useState } from "react";
import {
  idleReservationAdminState,
  updateReservationAdminState,
  type ReservationAdminState
} from "@/app/actions/reservations-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

type ReservationRecord = {
  id: string;
  created_at: string;
  reservation_date: string;
  reservation_time: string;
  party_size: string;
  name: string;
  email: string;
  note?: string | null;
  status?: string | null;
  handled_at?: string | null;
  handled_by?: string | null;
  admin_note?: string | null;
};

const statusLabels: Record<string, string> = {
  new: "Nieuw",
  contacted: "Gecontacteerd",
  confirmed: "Bevestigd",
  archived: "Afgesloten"
};

function ReservationAdminCard({ reservation }: { reservation: ReservationRecord }) {
  const [state, formAction] = useActionState(updateReservationAdminState, idleReservationAdminState);
  const [status, setStatus] = useState(reservation.status || "new");
  const [handledBy, setHandledBy] = useState(reservation.handled_by || "");
  const [adminNote, setAdminNote] = useState(reservation.admin_note || "");
  const [handledAt, setHandledAt] = useState<string | null>(reservation.handled_at || null);

  useEffect(() => {
    if (!state.success || state.reservationId !== reservation.id) {
      return;
    }

    setStatus(state.status || "new");
    setHandledBy(state.handledBy || "");
    setAdminNote(state.adminNote || "");
    setHandledAt(state.handledAt || null);
  }, [reservation.id, state]);

  return (
    <article className="admin-card">
      <div className="admin-card-topline">
        <div>
          <p className="eyebrow">{reservation.party_size} personen</p>
          <h3>{reservation.name}</h3>
        </div>
        <span className={`admin-pill admin-pill-${status}`}>{statusLabels[status] || status}</span>
      </div>

      <div className="admin-meta-grid">
        <p><strong>Datum:</strong> {new Date(reservation.reservation_date).toLocaleDateString("nl-BE")}</p>
        <p><strong>Uur:</strong> {reservation.reservation_time}</p>
        <p><strong>Aangevraagd:</strong> {new Date(reservation.created_at).toLocaleString("nl-BE")}</p>
        <p><strong>E-mail:</strong> <a href={`mailto:${reservation.email}`}>{reservation.email}</a></p>
      </div>

      {reservation.note ? (
        <p className="admin-note-block">
          <strong>Opmerking gast:</strong> {reservation.note}
        </p>
      ) : null}

      <form className="contact-form admin-form" action={formAction}>
        <input type="hidden" name="reservation_id" value={reservation.id} />
        <label>
          Status
          <select name="status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="new">Nieuw</option>
            <option value="contacted">Gecontacteerd</option>
            <option value="confirmed">Bevestigd</option>
            <option value="archived">Afgesloten</option>
          </select>
        </label>
        <label>
          Behandeld door
          <input
            name="handled_by"
            type="text"
            value={handledBy}
            placeholder="Optioneel: naam medewerker"
            onChange={(event) => setHandledBy(event.target.value)}
          />
        </label>
        <label>
          Interne notitie
          <textarea
            name="admin_note"
            rows={3}
            value={adminNote}
            placeholder="Bv. bevestigd per mail, tafel binnen, allergie doorgegeven..."
            onChange={(event) => setAdminNote(event.target.value)}
          />
        </label>
        <div className="admin-card-actions">
          <SubmitButton>Bewaar opvolging</SubmitButton>
          {handledAt ? (
            <p className="admin-helptext">
              Laatst verwerkt op {new Date(handledAt).toLocaleString("nl-BE")}
            </p>
          ) : (
            <p className="admin-helptext">Nog niet intern opgevolgd.</p>
          )}
        </div>
        <FormFeedback state={state as ReservationAdminState} />
      </form>
    </article>
  );
}

export function ReservationAdminBoard({ reservations }: { reservations: ReservationRecord[] }) {
  if (!reservations.length) {
    return (
      <div className="venue-layout venue-form-layout">
        <article className="venue-panel venue-panel-accent">
          <h3>Nog geen reservaties</h3>
          <p>Nieuwe reservatieaanvragen verschijnen hier zodra ze via de site binnenkomen.</p>
        </article>
      </div>
    );
  }

  const sortedReservations = [...reservations].sort((left, right) => {
    const leftPriority = left.status === "new" ? 0 : left.status === "contacted" ? 1 : 2;
    const rightPriority = right.status === "new" ? 0 : right.status === "contacted" ? 1 : 2;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });

  return (
    <div className="admin-board">
      {sortedReservations.map((reservation) => (
        <ReservationAdminCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}
