const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HAS_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const HTML_TAG_CHARS = /[<>]/g;
const SUSPICIOUS_QUERY_PATTERN =
  /(--|\/\*|\*\/|\bunion\s+select\b|\b(select|insert|update|delete|drop|alter|truncate)\b[\s\S]{0,40}\b(from|into|table|where|set|values)\b|\b(or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/i;

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

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

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
    if (HAS_CONTROL_CHARS.test(value) || hasSuspiciousQuery(value)) {
      return `${label} contains unsupported characters or query-like text.`;
    }
  }

  return null;
}

export function sanitizeInputValue(value: unknown, maxLength = 1000): unknown {
  if (typeof value === 'string') {
    return value.includes('\n')
      ? sanitizeMultilineText(value, maxLength)
      : sanitizeText(value, maxLength);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeInputValue(item, maxLength));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        sanitizeInputValue(entry, maxLength),
      ])
    );
  }

  return value;
}

export function validateSafePayload(value: unknown, label = 'Input'): string | null {
  if (typeof value === 'string') {
    return validateSafeFields({ [label]: value });
  }

  if (Array.isArray(value)) {
    for (const [index, entry] of value.entries()) {
      const message = validateSafePayload(entry, `${label} ${index + 1}`);
      if (message) return message;
    }
  }

  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value as Record<string, JsonLike>)) {
      const message = validateSafePayload(entry, key);
      if (message) return message;
    }
  }

  return null;
}
