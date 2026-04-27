"use client";

import { useEffect, useRef } from "react";
import type { FormStatus } from "@/lib/forms";
import { trackDataLayerEvent } from "@/lib/tracking";

export function useTrackFormSuccess(
  state: FormStatus,
  buildPayload: () => Array<{ event: string; payload?: Record<string, unknown> }>
) {
  const lastTrackedMessageRef = useRef<string>("");

  useEffect(() => {
    if (!state.success || !state.message) {
      return;
    }

    if (lastTrackedMessageRef.current === state.message) {
      return;
    }

    lastTrackedMessageRef.current = state.message;

    for (const item of buildPayload()) {
      trackDataLayerEvent(item.event, item.payload);
    }
  }, [buildPayload, state.message, state.success]);
}
