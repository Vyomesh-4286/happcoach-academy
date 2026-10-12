// Small helpers for the HTML that Edmingle returns in course fields.

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', bull: '•', rupee: '₹',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Turns HTML into plain text: "<p>Hi&nbsp;there</p>" → "Hi there". */
export function toText(html: string | null | undefined): string {
  if (!html) return '';
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li|h\d)>/gi, ' ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Shortens text to about `max` characters on a word boundary. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max) > 0 ? text.lastIndexOf(' ', max) : max).trim() + '…';
}

/**
 * Keeps simple formatting (paragraphs, lists, bold, links) from your own
 * Edmingle content and drops anything that could run code.
 */
export function cleanHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    // Paired tags: remove the tag and everything inside it.
    .replace(/<(script|style|iframe|object|embed|form|textarea|select|button|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    // Any leftover opening/closing/void tags of those kinds.
    .replace(/<\/?(script|style|iframe|object|embed|form|input|button|textarea|select|meta|link|base|noscript|template)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(style|class|id)\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    .trim();
}
