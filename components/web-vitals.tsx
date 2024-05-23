"use client";

import { useReportWebVitals } from "next/web-vitals";

function WebVitals() {
  useReportWebVitals(({ id, value, delta, name }) => {
    window.gtag("event", name, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      metric_value: value,
      metric_delta: delta,
      non_interaction: true,
    });
  });

  return <></>;
}

export default WebVitals;
