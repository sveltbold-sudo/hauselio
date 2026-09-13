export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0] as string)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
