import { NextResponse } from "next/server";

async function getToken() {
  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  return (await res.json()).access_token;
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");

  if (!q) return NextResponse.json([]);

  const token = await getToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=8`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  const tracks =
    data.tracks?.items?.map((t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.map((a:any)=>a.name).join(", "),
      image: t.album?.images?.[1]?.url,
      spotifyUrl: t.external_urls?.spotify,
      previewUrl: t.preview_url,
    })) || [];

  return NextResponse.json(tracks);
}