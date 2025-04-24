import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  console.log("Cookie token:", token);

  if (!token) {
    console.log("Cookie net");

    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const spotifyRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!spotifyRes.ok) {
    const errText = await spotifyRes.text();
    console.error("Spotify API error:", errText);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  const user = await spotifyRes.json();
  return NextResponse.json(user);
}
