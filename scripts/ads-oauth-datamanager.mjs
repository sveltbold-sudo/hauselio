// Local uniquement : regenere un refresh token Google avec les scopes
// Data Manager API + Google Ads API (le token actuel n'a que le scope adwords).
// Usage:
//   1. node scripts/ads-oauth-datamanager.mjs
//   2. Ouvrir l'URL affichee, approuver avec le compte Google Ads (MCC 3189801878)
//   3. Coller le "code" (ou laisser le serveur local le capturer tout seul)
//   4. Copier le refresh token dans .env (GOOGLE_ADS_REFRESH_TOKEN) + Vercel
// Pre-requis : activer "Data Manager API" dans le projet Google Cloud
// (console.cloud.google.com > APIs & Services > Enable APIs).
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createInterface } from "node:readline";

function loadEnv() {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env");
  const out = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = loadEnv();
const CLIENT_ID = env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_ADS_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("GOOGLE_ADS_CLIENT_ID/SECRET manquants dans .env");
  process.exit(1);
}

const PORT = 8085;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/datamanager",
  "https://www.googleapis.com/auth/adwords",
].join(" ");

const url =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
  });

console.log("\n1. Ouvrez cette URL dans le navigateur (compte Google Ads/MCC) :\n");
console.log(url);
console.log("\n2. Approuvez, puis la page redirige vers localhost (capture auto).");
console.log("   Si erreur redirect_uri_mismatch : ajoutez");
console.log(`   ${REDIRECT}`);
console.log("   dans Cloud Console > APIs & Services > Credentials > votre OAuth client.\n");

function waitForCode() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const u = new URL(req.url, `http://localhost:${PORT}`);
      const code = u.searchParams.get("code");
      const err = u.searchParams.get("error");
      if (code) {
        res.end("OK — revenez au terminal.");
        server.close();
        resolve(code);
      } else {
        res.end(`Erreur: ${err || "pas de code"}`);
      }
    });
    server.listen(PORT, () => console.log(`(en attente sur ${REDIRECT} — ou collez le code ci-dessous)`));
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Code (Entree si capture auto) : ", (answer) => {
      rl.close();
      if (answer.trim()) {
        server.close();
        resolve(answer.trim());
      }
      // sinon on attend la capture auto
    });
  });
}

const code = await waitForCode();
const res = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT,
    grant_type: "authorization_code",
  }),
});
const data = await res.json();
if (!res.ok) {
  console.error("Echange echoue:", JSON.stringify(data));
  process.exit(1);
}
console.log("\n=== OK ===");
console.log("Nouveau GOOGLE_ADS_REFRESH_TOKEN (scopes datamanager+adwords) :");
console.log(data.refresh_token);
console.log("\nMettez-le dans .env ET dans Vercel > Settings > Environment Variables.");
