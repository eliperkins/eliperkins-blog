"use client";

import type { NextWebVitalsMetric } from "next/app";
import { useReportWebVitals } from "next/web-vitals";

const WebVitals = () => {
  useReportWebVitals(({ id, value, name }: NextWebVitalsMetric) => {
    window.gtag("event", name, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      metric_value: value,
      non_interaction: true,
    });
  });

  return null;
};

export default WebVitals;
