/**
 * One-time Spotify refresh token bootstrap.
 *
 * Prereqs:
 *   1. Create a Spotify app at https://developer.spotify.com/dashboard
 *   2. Add redirect URI exactly: http://127.0.0.1:8787/callback
 *   3. Export SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET in this shell
 *
 * Run:
 *   pnpm tsx scripts/spotify-auth.ts
 *
 * Then:
 *   wrangler secret put SPOTIFY_CLIENT_ID
 *   wrangler secret put SPOTIFY_CLIENT_SECRET
 *   wrangler secret put SPOTIFY_REFRESH_TOKEN
 */

import { randomBytes } from "node:crypto";
import { createServer } from "node:http";

const REDIRECT_URI = "http://127.0.0.1:8787/callback";
const PORT = 8787;
const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
].join(" ");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!(CLIENT_ID && CLIENT_SECRET)) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET env vars.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("state", state);

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  if (!code || returnedState !== state) {
    res.writeHead(400).end("bad request");
    server.close();
    process.exit(1);
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    res.writeHead(500).end(`token exchange failed: ${text}`);
    console.error(`token exchange failed: ${tokenRes.status}\n${text}`);
    server.close();
    process.exit(1);
  }

  const data = (await tokenRes.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  };

  res
    .writeHead(200, { "Content-Type": "text/html" })
    .end("<h1>Done. Check your terminal.</h1>");

  console.log(
    "\nRefresh token (paste into wrangler secret put SPOTIFY_REFRESH_TOKEN):\n"
  );
  console.log(data.refresh_token);
  console.log("\nScopes granted:", data.scope);

  server.close();
  process.exit(0);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\nOpen this URL in your browser:\n\n${authUrl.toString()}\n`);
});
