import posthog from "posthog-js";

type AnalyticsValue = string | number | boolean | null | undefined;

const ATTRIBUTION_PARAMS = [
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
] as const;

const FIRST_TOUCH_KEY = "feelz_first_touch_attribution";

function readAttributionFromLocation(): Record<string, AnalyticsValue> {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const attribution: Record<string, AnalyticsValue> = {
    current_url: window.location.href,
    current_path: window.location.pathname,
    current_search: window.location.search || null,
    referrer: document.referrer || null,
  };

  for (const key of ATTRIBUTION_PARAMS) {
    attribution[key] = params.get(key);
  }

  return attribution;
}

function getFirstTouchAttribution(
  current: Record<string, AnalyticsValue>,
): Record<string, AnalyticsValue> {
  if (typeof window === "undefined") {
    return {};
  }

  const existing = window.localStorage.getItem(FIRST_TOUCH_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as Record<string, AnalyticsValue>;
      return parsed;
    } catch {
      window.localStorage.removeItem(FIRST_TOUCH_KEY);
    }
  }

  const hasCampaignSignal = ATTRIBUTION_PARAMS.some((key) => current[key]);
  const firstTouch: Record<string, AnalyticsValue> = {
    first_touch_url: current.current_url,
    first_touch_path: current.current_path,
    first_touch_referrer: current.referrer,
  };

  for (const key of ATTRIBUTION_PARAMS) {
    firstTouch[`first_${key}`] = current[key] ?? null;
  }

  if (hasCampaignSignal || current.referrer) {
    window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
  }

  return firstTouch;
}

function getAttributionProperties(): Record<string, AnalyticsValue> {
  const current = readAttributionFromLocation();
  const firstTouch = getFirstTouchAttribution(current);
  return { ...current, ...firstTouch };
}

export function capture(
  event: string,
  properties?: Record<string, AnalyticsValue>,
) {
  posthog.capture(event, {
    ...getAttributionProperties(),
    ...properties,
  });
}
