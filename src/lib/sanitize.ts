const HTML_TAG_REGEX = /<[^>]*>/g;
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export function sanitizeText(input: unknown, maxLength = 5000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(HTML_TAG_REGEX, "")
    .replace(CONTROL_CHARS_REGEX, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(input: unknown): string {
  const email = sanitizeText(input, 254).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : "";
}

export function sanitizePhone(input: unknown): string {
  return sanitizeText(input, 20).replace(/[^\d+\s()-]/g, "");
}

export function sanitizeUrl(input: unknown): string {
  const url = sanitizeText(input, 2048);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

export function sanitizeId(input: unknown): string {
  return sanitizeText(input, 64).replace(/[^a-zA-Z0-9_-]/g, "");
}

export function sanitizeImagePath(input: unknown): string {
  const value = sanitizeText(input, 512);
  if (/^\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)$/.test(value)) {
    return value;
  }

  const url = sanitizeUrl(value);
  if (url && /\/storage\/v1\/object\/public\/.+\/.+\.(jpg|jpeg|png|webp)$/i.test(url)) {
    return url;
  }

  return "";
}
