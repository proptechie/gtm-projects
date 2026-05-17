const STORAGE_KEY = "conduit_attribution_v1";

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
  "li_fat_id",
  "ttclid",
  "irclickid",
] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  li_fat_id?: string;
  ttclid?: string;
  irclickid?: string;
  landing_url?: string;
  landing_referrer?: string;
  landing_timestamp?: string;
  current_url?: string;
  referrer?: string;
};

export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing) return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const captured: Attribution = {
      landing_url: window.location.href,
      landing_referrer: document.referrer || "",
      landing_timestamp: new Date().toISOString(),
    };

    for (const key of TRACKED_PARAMS) {
      const value = params.get(key);
      if (value) captured[key] = value;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  } catch {
    // sessionStorage unavailable (private mode, etc.) — silently skip
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  let stored: Attribution = {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw) as Attribution;
  } catch {
    // ignore
  }

  return {
    ...stored,
    current_url: window.location.href,
    referrer: document.referrer || "",
  };
}
