"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { updateVenueAdminState, type VenueAdminState } from "@/app/actions/venue-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

type VenueInquiryRecord = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  event_type: string;
  preferred_date: string;
  guest_count: string;
  message?: string | null;
  status?: string | null;
  handled_at?: string | null;
  handled_by?: string | null;
  admin_note?: string | null;
};

const statusLabels: Record<string, string> = {
  new: "Nieuw",
  contacted: "Gecontacteerd",
  quoted: "Offerte verstuurd",
  confirmed: "Bevestigd",
  archived: "Afgesloten"
};

function isArchivedInquiry(inquiry: VenueInquiryRecord, todayKey: string) {
  if (inquiry.status === "archived") {
    return true;
  }

  return inquiry.preferred_date < todayKey;
}

function VenueAdminCard({
  inquiry,
  onUpdated
}: {
  inquiry: VenueInquiryRecord;
  onUpdated: (inquiryId: string, updates: Partial<VenueInquiryRecord>) => void;
}) {
  const [state, formAction] = useActionState(updateVenueAdminState, {
    success: false,
    message: ""
  });
  const [status, setStatus] = useState(inquiry.status || "new");
  const [handledBy, setHandledBy] = useState(inquiry.handled_by || "");
  const [adminNote, setAdminNote] = useState(inquiry.admin_note || "");
  const [handledAt, setHandledAt] = useState<string | null>(inquiry.handled_at || null);

  useEffect(() => {
    if (!state.success || state.inquiryId !== inquiry.id) {
      return;
    }

    setStatus(state.status || "new");
    setHandledBy(state.handledBy || "");
    setAdminNote(state.adminNote || "");
    setHandledAt(state.handledAt || null);
    onUpdated(inquiry.id, {
      status: state.status || "new",
      handled_by: state.handledBy || null,
      admin_note: state.adminNote || null,
      handled_at: state.handledAt || null
    });
  }, [inquiry.id, onUpdated, state]);

  return (
    <article className="admin-card">
      <div className="admin-card-topline">
        <div>
          <p className="admin-card-kicker">{inquiry.guest_count} gasten</p>
          <h3>{inquiry.name}</h3>
        </div>
        <span className={`admin-pill admin-pill-${status}`}>{statusLabels[status] || status}</span>
      </div>

      <div className="admin-meta-grid">
        <p><strong>Type event:</strong> {inquiry.event_type}</p>
        <p><strong>Voorkeursdatum:</strong> {new Date(inquiry.preferred_date).toLocaleDateString("nl-BE")}</p>
        <p><strong>Aangevraagd:</strong> {new Date(inquiry.created_at).toLocaleString("nl-BE")}</p>
        <p><strong>E-mail:</strong> <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></p>
      </div>

      {inquiry.message ? (
        <p className="admin-note-block">
          <strong>Bericht klant:</strong> {inquiry.message}
        </p>
      ) : null}

      <form className="contact-form admin-form" action={formAction}>
        <input type="hidden" name="inquiry_id" value={inquiry.id} />
        <label>
          Status
          <select name="status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="new">Nieuw</option>
            <option value="contacted">Gecontacteerd</option>
            <option value="quoted">Offerte verstuurd</option>
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
            placeholder="Bv. offerte verstuurd, klant gebeld, datum niet beschikbaar..."
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
        <FormFeedback state={state as VenueAdminState} />
      </form>
    </article>
  );
}

export function VenueAdminBoard({ inquiries }: { inquiries: VenueInquiryRecord[] }) {
  const [inquiryList, setInquiryList] = useState(inquiries);
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");

  useEffect(() => {
    setInquiryList(inquiries);
  }, [inquiries]);

  if (!inquiries.length) {
    return (
      <div className="venue-layout venue-form-layout">
        <article className="venue-panel venue-panel-accent">
          <h3>Nog geen offerteaanvragen</h3>
          <p>Nieuwe verhuuraanvragen verschijnen hier zodra ze via de site binnenkomen.</p>
        </article>
      </div>
    );
  }

  const todayKey = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Brussels"
  });

  const sortedInquiries = [...inquiryList].sort((left, right) => {
    const leftPriority =
      left.status === "new" ? 0 : left.status === "contacted" ? 1 : left.status === "quoted" ? 2 : 3;
    const rightPriority =
      right.status === "new" ? 0 : right.status === "contacted" ? 1 : right.status === "quoted" ? 2 : 3;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });

  const activeInquiries = useMemo(
    () => sortedInquiries.filter((inquiry) => !isArchivedInquiry(inquiry, todayKey)),
    [sortedInquiries, todayKey]
  );
  const archivedInquiries = useMemo(
    () => sortedInquiries.filter((inquiry) => isArchivedInquiry(inquiry, todayKey)),
    [sortedInquiries, todayKey]
  );

  const visibleInquiries = activeTab === "active" ? activeInquiries : archivedInquiries;

  function updateInquiry(inquiryId: string, updates: Partial<VenueInquiryRecord>) {
    setInquiryList((current) =>
      current.map((inquiry) => (inquiry.id === inquiryId ? { ...inquiry, ...updates } : inquiry))
    );
  }

  return (
    <>
      <div className="admin-tabs" role="tablist" aria-label="Offerteoverzicht">
        <button
          className={`admin-tab ${activeTab === "active" ? "is-active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "active"}
          onClick={() => setActiveTab("active")}
        >
          Actief
          <span className="admin-tab-count">{activeInquiries.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === "archive" ? "is-active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "archive"}
          onClick={() => setActiveTab("archive")}
        >
          Archief
          <span className="admin-tab-count">{archivedInquiries.length}</span>
        </button>
      </div>

      {visibleInquiries.length ? (
        <div className="admin-board">
          {visibleInquiries.map((inquiry) => (
            <VenueAdminCard
              key={inquiry.id}
              inquiry={inquiry}
              onUpdated={updateInquiry}
            />
          ))}
        </div>
      ) : (
        <div className="venue-layout venue-form-layout">
          <article className="venue-panel venue-panel-accent">
            <h3>{activeTab === "active" ? "Geen actieve offerteaanvragen" : "Archief is nog leeg"}</h3>
            <p>
              {activeTab === "active"
                ? "Voorbije aanvragen en aanvragen met status Afgesloten verschijnen automatisch in het archief."
                : "Zodra een aanvraag voorbij is of als Afgesloten gemarkeerd wordt, verschijnt die hier."}
            </p>
          </article>
        </div>
      )}
    </>
  );
}
