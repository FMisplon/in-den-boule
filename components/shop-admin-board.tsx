"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  updateShopOrderAdminState,
  type ShopAdminState
} from "@/app/actions/shop-admin";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";

type ShopOrderRecord = {
  id: string;
  created_at: string;
  purchaser_name: string;
  purchaser_email: string;
  recipient_name: string;
  recipient_email?: string | null;
  personal_message?: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  mollie_payment_id?: string | null;
  fulfillment_mode?: string | null;
  pickup_in_store?: boolean | null;
  voucher_issued_at?: string | null;
  fulfillment_sent_at?: string | null;
  product_slug?: string | null;
  product_title?: string | null;
  admin_status?: string | null;
  handled_at?: string | null;
  handled_by?: string | null;
  admin_note?: string | null;
  gift_cards?: Array<{
    voucher_code: string;
    redeemed_at?: string | null;
  }> | null;
};

const adminStatusLabels: Record<string, string> = {
  new: "Nieuw",
  processing: "In verwerking",
  ready: "Klaar",
  completed: "Afgerond"
};

function formatAmount(order: ShopOrderRecord) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: order.currency || "EUR"
  }).format(order.amount_cents / 100);
}

function ShopAdminCard({ order }: { order: ShopOrderRecord }) {
  const [state, formAction] = useActionState(updateShopOrderAdminState, {
    success: false,
    message: ""
  });
  const [adminStatus, setAdminStatus] = useState(order.admin_status || "new");
  const [handledBy, setHandledBy] = useState(order.handled_by || "");
  const [adminNote, setAdminNote] = useState(order.admin_note || "");
  const [handledAt, setHandledAt] = useState<string | null>(order.handled_at || null);

  useEffect(() => {
    if (!state.success || state.orderId !== order.id) {
      return;
    }

    setAdminStatus(state.adminStatus || "new");
    setHandledBy(state.handledBy || "");
    setAdminNote(state.adminNote || "");
    setHandledAt(state.handledAt || null);
  }, [order.id, state]);

  const voucher = order.gift_cards?.[0];

  return (
    <article className="admin-card">
      <div className="admin-card-topline">
        <div>
          <p className="eyebrow">{order.product_title || "Digitale cadeaubon"}</p>
          <h3>{order.recipient_name}</h3>
        </div>
        <span className={`admin-pill admin-pill-${adminStatus}`}>
          {adminStatusLabels[adminStatus] || adminStatus}
        </span>
      </div>

      <div className="admin-meta-grid">
        <p><strong>Koper:</strong> {order.purchaser_name}</p>
        <p><strong>Bedrag:</strong> {formatAmount(order)}</p>
        <p><strong>Betaalstatus:</strong> {order.status}</p>
        <p><strong>Aangevraagd:</strong> {new Date(order.created_at).toLocaleString("nl-BE")}</p>
        <p><strong>Koper mail:</strong> <a href={`mailto:${order.purchaser_email}`}>{order.purchaser_email}</a></p>
        <p>
          <strong>Levering:</strong>{" "}
          {order.pickup_in_store
            ? "Afhaling in café"
            : order.fulfillment_mode === "send"
              ? `Rechtstreeks naar ${order.recipient_email || "ontvanger"}`
              : "Naar koper"}
        </p>
      </div>

      {order.personal_message ? (
        <p className="admin-note-block">
          <strong>Persoonlijke boodschap:</strong> {order.personal_message}
        </p>
      ) : null}

      <div className="admin-meta-grid">
        <p><strong>Voucher:</strong> {voucher?.voucher_code || "Nog niet uitgegeven"}</p>
        <p><strong>Voucher mail:</strong> {order.fulfillment_sent_at ? "Verzonden" : "Nog niet verzonden"}</p>
        <p><strong>Voucher status:</strong> {voucher?.redeemed_at ? "Ingeruild" : "Nog actief"}</p>
        {voucher?.voucher_code ? (
          <p>
            <strong>Link:</strong>{" "}
            <Link href={`/cadeaubonnen/${voucher.voucher_code}`}>Open cadeaubon</Link>
          </p>
        ) : null}
      </div>

      <form className="contact-form admin-form" action={formAction}>
        <input type="hidden" name="order_id" value={order.id} />
        <label>
          Interne status
          <select
            name="admin_status"
            value={adminStatus}
            onChange={(event) => setAdminStatus(event.target.value)}
          >
            <option value="new">Nieuw</option>
            <option value="processing">In verwerking</option>
            <option value="ready">Klaar</option>
            <option value="completed">Afgerond</option>
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
            placeholder="Bv. afhaling bevestigd, voucher opnieuw gemaild, klant gebeld..."
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
        <FormFeedback state={state as ShopAdminState} />
      </form>
    </article>
  );
}

export function ShopAdminBoard({ orders }: { orders: ShopOrderRecord[] }) {
  if (!orders.length) {
    return (
      <div className="venue-layout venue-form-layout">
        <article className="venue-panel venue-panel-accent">
          <h3>Nog geen shopbestellingen</h3>
          <p>Nieuwe cadeaubonbestellingen verschijnen hier zodra ze via de site binnenkomen.</p>
        </article>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((left, right) => {
    const leftPriority = left.admin_status === "new" ? 0 : left.admin_status === "processing" ? 1 : 2;
    const rightPriority = right.admin_status === "new" ? 0 : right.admin_status === "processing" ? 1 : 2;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });

  return (
    <div className="admin-board">
      {sortedOrders.map((order) => (
        <ShopAdminCard key={order.id} order={order} />
      ))}
    </div>
  );
}
