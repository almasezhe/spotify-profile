// app/api/spotify/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const headers = { Authorization: `Bearer ${token}` };
  const endpoints = {
    profile: "https://api.spotify.com/v1/me",
    topArtists: "https://api.spotify.com/v1/me/top/artists?limit=10",
    topTracks: "https://api.spotify.com/v1/me/top/tracks?limit=10",
    playlists: "https://api.spotify.com/v1/me/playlists?limit=10",
    recentlyPlayed: "https://api.spotify.com/v1/me/player/recently-played?limit=10",
    currentlyPlaying: "https://api.spotify.com/v1/me/player/currently-playing",
  };

  // хелпер, который возвращает data или null/[]
  async function fetchSafe(url: string) {
    try {
      const r = await axios.get(url, { headers });
      return r.data;
    } catch (e: any) {
      console.warn(`Spotify endpoint failed (${url}):`, e.response?.status);
      return null;
    }
  }

  // параллельно тащим всё
  const [
    profile,
    topArtistsData,
    topTracksData,
    playlistsData,
    recentData,
    currentData,
  ] = await Promise.all([
    fetchSafe(endpoints.profile),
    fetchSafe(endpoints.topArtists),
    fetchSafe(endpoints.topTracks),
    fetchSafe(endpoints.playlists),
    fetchSafe(endpoints.recentlyPlayed),
    fetchSafe(endpoints.currentlyPlaying),
  ]);

  return NextResponse.json({
    profile,
    topArtists: topArtistsData?.items ?? [],
    topTracks: topTracksData?.items ?? [],
    playlists: playlistsData?.items ?? [],
    recentlyPlayed: recentData?.items ?? [],
    currentlyPlaying: currentData ?? null,
  });
}
