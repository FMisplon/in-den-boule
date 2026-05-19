"use client";

import jsQR from "jsqr";
import { useActionState, useEffect, useRef, useState } from "react";
import { checkInEventTicket } from "@/app/actions/event-tickets";
import { FormFeedback } from "@/components/form-feedback";
import { SubmitButton } from "@/components/submit-button";
import { idleCheckInState } from "@/lib/check-in-state";

type CheckInScannerProps = {
  requiresAccessCode: boolean;
};

type BarcodeDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>>;
};

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

export function CheckInScanner({ requiresAccessCode }: CheckInScannerProps) {
  const [state, formAction] = useActionState(checkInEventTicket, idleCheckInState);
  const [scanValue, setScanValue] = useState("");
  const [scannerAvailable, setScannerAvailable] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setScannerAvailable(Boolean(navigator.mediaDevices?.getUserMedia));
  }, []);

  useEffect(() => {
    setScanValue((current) => (state.ticketCode ? state.ticketCode : current));
  }, [state.ticketCode]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function stopScanner() {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    detectorRef.current = null;
    setScannerActive(false);
  }

  async function startScanner() {
    const detectorCtor = (globalThis as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;

    if (!navigator.mediaDevices?.getUserMedia) {
      setScannerMessage("Camera-scanner is niet beschikbaar in deze browser. Plak de ticketlink of code manueel.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });

      streamRef.current = stream;
      detectorRef.current = detectorCtor ? new detectorCtor({ formats: ["qr_code"] }) : null;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setScannerActive(true);
      setScannerMessage(
        detectorRef.current
          ? "Richt de camera op de QR-code van het ticket."
          : "Richt de camera op de QR-code van het ticket. Safari gebruikt hier de ingebouwde beeldscanner als fallback."
      );

      const scanFrame = async () => {
        if (!videoRef.current) {
          return;
        }

        if (videoRef.current.readyState < 2) {
          frameRef.current = requestAnimationFrame(scanFrame);
          return;
        }

        try {
          let matchedValue = "";

          if (detectorRef.current) {
            const results = await detectorRef.current.detect(videoRef.current);
            const match = results.find((item) => item.rawValue?.trim());
            matchedValue = match?.rawValue?.trim() || "";
          } else if (canvasRef.current) {
            const width = videoRef.current.videoWidth;
            const height = videoRef.current.videoHeight;

            if (width && height) {
              canvasRef.current.width = width;
              canvasRef.current.height = height;
              const context = canvasRef.current.getContext("2d", { willReadFrequently: true });

              if (context) {
                context.drawImage(videoRef.current, 0, 0, width, height);
                const imageData = context.getImageData(0, 0, width, height);
                const qrResult = jsQR(imageData.data, width, height);
                matchedValue = qrResult?.data?.trim() || "";
              }
            }
          }

          if (matchedValue) {
            setScanValue(matchedValue);
            setScannerMessage("QR-code gelezen. Controleer en bevestig de check-in.");
            await stopScanner();
            return;
          }
        } catch {
          setScannerMessage("Scannen lukt momenteel niet. Je kunt ook de ticketlink of code plakken.");
          await stopScanner();
          return;
        }

        frameRef.current = requestAnimationFrame(scanFrame);
      };

      frameRef.current = requestAnimationFrame(scanFrame);
    } catch {
      setScannerMessage("Camera kon niet geopend worden. Controleer permissies of plak de ticketlink manueel.");
      await stopScanner();
    }
  }

  const statusClassName =
    state.resultStatus === "valid"
      ? "checkin-result checkin-result-valid"
      : state.resultStatus === "used"
        ? "checkin-result checkin-result-used"
        : state.resultStatus === "refunded"
          ? "checkin-result checkin-result-refunded"
          : state.resultStatus === "invalid"
            ? "checkin-result checkin-result-invalid"
            : "checkin-result";

  return (
    <div className="venue-layout venue-form-layout">
      <article className="venue-panel venue-panel-accent">
        <h3>Scan of plak ticket</h3>
        <p>
          Scan de QR-code met de camera of plak een ticketlink zoals <code>/tickets/...</code>.
        </p>
        {requiresAccessCode ? (
          <p style={{ marginTop: "0.75rem" }}>
            Deze pagina is beschermd met een staffcode. Deel die code alleen intern.
          </p>
        ) : null}
        <div className="checkin-scanner-actions">
          <button className="button" type="button" onClick={startScanner} disabled={scannerActive || !scannerAvailable}>
            {scannerActive ? "Scanner actief" : "Start QR-scanner"}
          </button>
          {scannerActive ? (
            <button className="button button-secondary" type="button" onClick={stopScanner}>
              Stop scanner
            </button>
          ) : null}
        </div>
        {scannerMessage ? <p className="checkin-scanner-message">{scannerMessage}</p> : null}
        {scannerAvailable ? (
          <div className="checkin-video-shell">
            <video ref={videoRef} muted playsInline className="checkin-video" />
            <canvas ref={canvasRef} hidden aria-hidden="true" />
          </div>
        ) : (
          <p className="checkin-scanner-message">
            Deze browser kan de camera niet openen. Gebruik eventueel de camera-app en plak daarna de link of code hieronder.
          </p>
        )}
      </article>

      <article className="venue-panel">
        <form className="contact-form" action={formAction}>
          <label>
            Ticketlink of code
            <input
              name="scan_value"
              type="text"
              value={scanValue}
              onChange={(event) => setScanValue(event.target.value)}
              placeholder="https://.../tickets/tkt_xxx of tkt_xxx"
            />
          </label>
          <SubmitButton>Controleer ticket</SubmitButton>
          <FormFeedback state={state} />
        </form>

        {state.message ? (
          <div className={statusClassName}>
            <strong>{state.success ? "Geldig ticket" : "Controle resultaat"}</strong>
            {state.eventTitle ? <p><strong>Event:</strong> {state.eventTitle}</p> : null}
            {state.ticketTypeTitle ? <p><strong>Tickettype:</strong> {state.ticketTypeTitle}</p> : null}
            {state.customerName ? <p><strong>Naam:</strong> {state.customerName}</p> : null}
            {state.ticketCode ? <p><strong>Code:</strong> {state.ticketCode}</p> : null}
            {state.checkedInAt ? <p><strong>Check-in tijd:</strong> {new Date(state.checkedInAt).toLocaleString("nl-BE")}</p> : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}
