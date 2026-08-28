const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HAS_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const HTML_TAG_CHARS = /[<>]/g;
const SUSPICIOUS_QUERY_PATTERN =
  /(--|\/\*|\*\/|\bunion\s+select\b|\b(select|insert|update|delete|drop|alter|truncate)\b[\s\S]{0,40}\b(from|into|table|where|set|values)\b|\b(or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/i;

export function sanitizeText(value: string, maxLength = 300): string {
  return value
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAG_CHARS, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeMultilineText(value: string, maxLength = 1000): string {
  return value
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAG_CHARS, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: string): string {
  return sanitizeText(value, 254).toLowerCase();
}

export function sanitizePhone(value: string): string {
  return value.replace(/[^\d+()\s-]/g, '').trim().slice(0, 32);
}

export function sanitizePostcode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}

export function hasSuspiciousQuery(value: string): boolean {
  return SUSPICIOUS_QUERY_PATTERN.test(value);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function isSafePasswordInput(value: string): boolean {
  return value.length > 0 && value.length <= 128 && !HAS_CONTROL_CHARS.test(value);
}

export function validateSafeFields(fields: Record<string, string>): string | null {
  for (const [label, value] of Object.entries(fields)) {
    if (hasSuspiciousQuery(value)) {
      return `${label} contains unsupported characters or query-like text.`;
    }
  }

  return null;
}
