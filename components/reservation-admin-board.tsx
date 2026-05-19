"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
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

function formatPartySizeLabel(value: string) {
  const trimmed = value.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return "Aantal personen onbekend";
  }

  const normalized = trimmed
    .replace(/\bpersonen\b/gi, "personen")
    .replace(/\bpersoon\b/gi, "persoon")
    .replace(/(\bpersonen\b)(\s+\bpersonen\b)+/gi, "personen")
    .replace(/(\bpersoon\b)(\s+\bpersoon\b)+/gi, "persoon")
    .trim();

  return /persoon/i.test(normalized) ? normalized : `${normalized} personen`;
}

function isArchivedReservation(reservation: ReservationRecord, todayKey: string) {
  if (reservation.status === "archived") {
    return true;
  }

  return reservation.reservation_date < todayKey;
}

function ReservationAdminCard({
  reservation,
  onUpdated
}: {
  reservation: ReservationRecord;
  onUpdated: (reservationId: string, updates: Partial<ReservationRecord>) => void;
}) {
  const [state, formAction] = useActionState(updateReservationAdminState, {
    success: false,
    message: ""
  });
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
    onUpdated(reservation.id, {
      status: state.status || "new",
      handled_by: state.handledBy || null,
      admin_note: state.adminNote || null,
      handled_at: state.handledAt || null
    });
  }, [onUpdated, reservation.id, state]);

  return (
    <article className="admin-card">
      <div className="admin-card-topline">
        <div>
          <p className="admin-card-kicker">{formatPartySizeLabel(reservation.party_size)}</p>
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
  const [reservationList, setReservationList] = useState(reservations);
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");

  useEffect(() => {
    setReservationList(reservations);
  }, [reservations]);

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

  const todayKey = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Brussels"
  });

  const sortedReservations = [...reservationList].sort((left, right) => {
    const leftPriority = left.status === "new" ? 0 : left.status === "contacted" ? 1 : 2;
    const rightPriority = right.status === "new" ? 0 : right.status === "contacted" ? 1 : 2;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });

  const activeReservations = useMemo(
    () => sortedReservations.filter((reservation) => !isArchivedReservation(reservation, todayKey)),
    [sortedReservations, todayKey]
  );
  const archivedReservations = useMemo(
    () => sortedReservations.filter((reservation) => isArchivedReservation(reservation, todayKey)),
    [sortedReservations, todayKey]
  );

  const visibleReservations = activeTab === "active" ? activeReservations : archivedReservations;

  function updateReservation(reservationId: string, updates: Partial<ReservationRecord>) {
    setReservationList((current) =>
      current.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, ...updates } : reservation
      )
    );
  }

  return (
    <>
      <div className="admin-tabs" role="tablist" aria-label="Reservatieoverzicht">
        <button
          className={`admin-tab ${activeTab === "active" ? "is-active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "active"}
          onClick={() => setActiveTab("active")}
        >
          Actief
          <span className="admin-tab-count">{activeReservations.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === "archive" ? "is-active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "archive"}
          onClick={() => setActiveTab("archive")}
        >
          Archief
          <span className="admin-tab-count">{archivedReservations.length}</span>
        </button>
      </div>

      {visibleReservations.length ? (
        <div className="admin-board">
          {visibleReservations.map((reservation) => (
            <ReservationAdminCard
              key={reservation.id}
              reservation={reservation}
              onUpdated={updateReservation}
            />
          ))}
        </div>
      ) : (
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel venue-panel-accent">
            <h3>{activeTab === "active" ? "Geen actieve reservaties" : "Archief is nog leeg"}</h3>
            <p>
              {activeTab === "active"
                ? "Voorbije reservaties en reservaties met status Afgesloten verschijnen automatisch in het archief."
                : "Zodra reservaties voorbij zijn of manueel als Afgesloten gemarkeerd worden, verschijnen ze hier."}
            </p>
          </article>
        </div>
      )}
    </>
  );
}
