"use client";

import { useEffect, useRef } from "react";
import { trackDataLayerEvent } from "@/lib/tracking";

type ConversionTrackerProps = {
  event: string;
  payload?: Record<string, unknown>;
};

export function ConversionTracker({ event, payload = {} }: ConversionTrackerProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;
    trackDataLayerEvent(event, payload);
  }, [event, payload]);

  return null;
}
