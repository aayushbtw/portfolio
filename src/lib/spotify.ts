import { env } from "cloudflare:workers";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  images: SpotifyImage[];
  name: string;
  url: string;
}

export interface SpotifyTrack {
  album: { name: string; url: string; images: SpotifyImage[] };
  artists: { name: string; url: string }[];
  durationMs: number;
  id: string;
  name: string;
  playedAt?: string;
  url: string;
}

export interface NowPlaying {
  isPlaying: boolean;
  progressMs: number | null;
  track: SpotifyTrack | null;
}

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    env;

  console.log({ client_id: SPOTIFY_CLIENT_ID });
  const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`spotify token: ${res.status} ${text}`.trim());
  }

  const { access_token } = await json<{ access_token: string }>(res);
  return access_token;
}

async function json<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

async function spotifyFetch(path: string): Promise<Response> {
  const token = await getAccessToken();
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status !== 204 && !res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`spotify ${path}: ${res.status} ${text}`.trim());
  }

  return res;
}

interface RawImage {
  height: number;
  url: string;
  width: number;
}

interface RawArtist {
  external_urls: { spotify: string };
  id: string;
  images?: RawImage[];
  name: string;
}

interface RawTrack {
  album: {
    external_urls: { spotify: string };
    images: RawImage[];
    name: string;
  };
  artists: { external_urls: { spotify: string }; name: string }[];
  duration_ms: number;
  external_urls: { spotify: string };
  id: string;
  name: string;
}

interface NowPlayingResponse {
  currently_playing_type?: "track" | "episode" | "ad" | "unknown";
  is_playing: boolean;
  item: RawTrack | null;
  progress_ms: number | null;
}

interface RecentlyPlayedResponse {
  items: { track: RawTrack; played_at: string }[];
}

interface TopItemsResponse<T> {
  items: T[];
}

function mapArtist(a: RawArtist): SpotifyArtist {
  return {
    id: a.id,
    name: a.name,
    url: a.external_urls.spotify,
    images: a.images ?? [],
  };
}

function mapTrack(t: RawTrack, playedAt?: string): SpotifyTrack {
  return {
    id: t.id,
    name: t.name,
    url: t.external_urls.spotify,
    durationMs: t.duration_ms,
    artists: t.artists.map((ar) => ({
      name: ar.name,
      url: ar.external_urls.spotify,
    })),
    album: {
      name: t.album.name,
      url: t.album.external_urls.spotify,
      images: t.album.images,
    },
    playedAt,
  };
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const res = await spotifyFetch("/me/player/currently-playing");

  if (res.status === 204) {
    return { isPlaying: false, track: null, progressMs: null };
  }

  const data = await json<NowPlayingResponse | null>(res);

  if (!data?.item || data.currently_playing_type !== "track") {
    return { isPlaying: false, track: null, progressMs: null };
  }

  return {
    isPlaying: data.is_playing,
    progressMs: data.progress_ms,
    track: mapTrack(data.item),
  };
}

export async function getRecentlyPlayed(): Promise<SpotifyTrack[]> {
  const res = await spotifyFetch("/me/player/recently-played?limit=10");
  const { items } = await json<RecentlyPlayedResponse>(res);
  return items.map((i) => mapTrack(i.track, i.played_at));
}

export async function getTopArtists(): Promise<SpotifyArtist[]> {
  const res = await spotifyFetch(
    "/me/top/artists?time_range=short_term&limit=3"
  );
  const { items } = await json<TopItemsResponse<RawArtist>>(res);
  return items.map(mapArtist);
}

export async function getTopTracks(): Promise<SpotifyTrack[]> {
  const res = await spotifyFetch(
    "/me/top/tracks?time_range=short_term&limit=3"
  );
  const { items } = await json<TopItemsResponse<RawTrack>>(res);
  return items.map((t) => mapTrack(t));
}
