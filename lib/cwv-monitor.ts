import { onCLS, onLCP, onINP, onTTFB } from "web-vitals";
import * as Sentry from "@sentry/nextjs";

type MetricName = "LCP" | "CLS" | "INP" | "TTFB";

type Rating = "good" | "needs-improvement" | "poor";

const THRESHOLDS: Record<MetricName, [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  TTFB: [800, 1800],
};

function getRating(name: MetricName, value: number): Rating {
  const [good, poor] = THRESHOLDS[name];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

function sendToGA4(name: MetricName, value: number, rating: Rating, delta: number) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as Record<string, unknown>).gtag as
    | ((...args: unknown[]) => void)
    | undefined;
  if (!gtag) return;

  gtag("event", "core_web_vitals", {
    metric_name: name,
    metric_value: Math.round(name === "CLS" ? value * 1000 : value),
    metric_rating: rating,
    metric_delta: Math.round(name === "CLS" ? delta * 1000 : delta),
    non_interaction: true,
  });
}

function sendToSentry(name: MetricName, value: number, rating: Rating) {
  Sentry.setMeasurement(name, value, rating === "good" ? "none" : "custom");
  Sentry.addBreadcrumb({
    category: "performance",
    message: `${name}: ${Math.round(name === "CLS" ? value * 1000 : value)} (${rating})`,
    level: rating === "poor" ? "warning" : "info",
    data: { metric: name, value, rating },
  });
}

function handleMetric(metric: { name: string; value: number; delta: number }) {
  const name = metric.name.toUpperCase() as MetricName;
  const rating = getRating(name, metric.value);

  sendToGA4(name, metric.value, rating, metric.delta);
  sendToSentry(name, metric.value, rating);
}

export function initCWVMonitoring() {
  if (typeof window === "undefined") return;

  onCLS(handleMetric, { reportAllChanges: true });
  onLCP(handleMetric);
  onINP(handleMetric, { reportAllChanges: true });
  onTTFB(handleMetric);
}
