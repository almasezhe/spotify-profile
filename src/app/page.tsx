"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
type SpotifyData = {
  profile: {
    display_name: string;
    email: string;
    images: { url: string }[];
    followers: { total: number };
  };
  topArtists: Array<{ id: string; name: string; images: { url: string }[] }>;
  topTracks: Array<{
    id: string;
    name: string;
    album: { images: { url: string }[]; name: string };
    artists: { name: string }[];
    duration_ms: number;
  }>;
  playlists: Array<{
    id: string;
    name: string;
    images: { url: string }[];
    tracks: { total: number };
  }>;
  recentlyPlayed: Array<{
    track: {
      id: string;
      name: string;
      artists: { name: string }[];
      album: { images: { url: string }[] };
    };
    played_at: string;
  }>;
  currentlyPlaying: {
    item: {
      id: string;
      name: string;
      artists: { name: string }[];
      album: { images: { url: string }[] };
    };
    is_playing: boolean;
  } | null;
};


export default function HomePage() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<SpotifyData>("/api/spotify", { withCredentials: true })
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

 // пока грузится — спиннер
 if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
}

// если не залогинен или API отдал null
if (!data || !data.profile) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <a href="/api/login">
        <Button size="lg">Login with Spotify</Button>
      </a>
    </div>
  );
}

  const {
    profile,
    topArtists,
    topTracks,
    playlists,
    recentlyPlayed,
    currentlyPlaying,
  } = data;

  return (
  <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            {profile.images[0]?.url ? (
              <AvatarImage src={profile.images[0].url} alt="avatar" />
            ) : (
              <AvatarFallback>
                {profile.display_name[0]}
              </AvatarFallback> 
            )}
          </Avatar>
          <div>
            <CardTitle>{profile.display_name}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </div>
        </CardHeader>
      </Card>

        {currentlyPlaying && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {currentlyPlaying.is_playing ? "Playing" : "Paused"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <img
                src={currentlyPlaying.item.album.images[0].url}
                alt="album art"
                className="w-20 h-20 rounded-lg"
              />
              <div>
                <p className="font-medium">{currentlyPlaying.item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentlyPlaying.item.artists
                    .map((a) => a.name)
                    .join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      <Separator />

      {/* ——— Top Artists / Top Tracks / Playlists ——— */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="flex flex-wrap gap-4">
                {topArtists.map((a) => (
                  <div key={a.id} className="w-20 text-center">
                    <img
                      src={a.images[0]?.url}
                      alt={a.name}
                      className="w-20 h-20 rounded-full mx-auto"
                    />
                    <p className="mt-2 text-sm">{a.name}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <ol className="list-decimal pl-5 space-y-2">
                {topTracks.map((t) => (
                  <li key={t.id}>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.artists.map((a) => a.name).join(", ")} —{" "}
                      {Math.floor(t.duration_ms / 60000)}:
                      {String(
                        Math.floor((t.duration_ms % 60000) / 1000)
                      ).padStart(2, "0")}
                    </p>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Playlists</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="grid grid-cols-2 gap-4">
                {playlists.map((pl) => (
                  <div key={pl.id} className="text-center">
                    <img
                      src={pl.images[0]?.url}
                      alt={pl.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <p className="mt-1 text-sm font-medium">{pl.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pl.tracks.total} tracks
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* ——— Recently Played ——— */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Played</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-60">
            <ol className="list-decimal pl-5 space-y-3">
              {recentlyPlayed.map((r, i) => (
                <li key={i}>
                  <p className="font-medium">{r.track.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.track.artists.map((a) => a.name).join(", ")} —{" "}
                    {new Date(r.played_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
