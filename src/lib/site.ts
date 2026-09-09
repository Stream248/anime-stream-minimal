export const SITE_NAME = "Comic Home";

/**
 * The intended production domain. Documented here as the target for the
 * custom-domain setup and used as a fallback when `window` is unavailable.
 */
export const SITE_URL = "https://comichome.app";

/**
 * Base URL for canonical, Open Graph and structured-data tags. Uses the
 * origin the app is actually served from — the Freebuff preview URL today,
 * comichome.app once it's registered and connected — so the tags never point
 * at a domain that doesn't resolve yet.
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return SITE_URL;
}

/** Absolute URL for the social share image (crawlers require absolute). */
export function getShareImageUrl(): string {
  return `${getSiteUrl()}/og-image.png`;
}
