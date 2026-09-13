export function toCustomerId(email: string): string {
  const input = email.toLowerCase().trim();
  if (!input) return "";
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0") + ((hash * 0x45d9f3b) >>> 0).toString(16).padStart(8, "0");
}
