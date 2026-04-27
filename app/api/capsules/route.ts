import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const placeName = searchParams.get("placeName");

  const capsules = await prisma.storyCapsule.findMany({
    where: {
      userId,
      ...(placeName ? { placeName } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(capsules);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in first" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const capsule = await prisma.storyCapsule.create({
    data: {
      userId,

      placeName: body.placeName,
      state: body.state || null,
      lat: body.lat || null,
      lng: body.lng || null,

      caption: body.caption || null,
      quote: body.quote || null,

      mood: body.mood || null,
      overhyped: body.overhyped || null,
      hiddenGem: body.hiddenGem || null,

      songTitle: body.songTitle || null,
      artist: body.artist || null,
      spotifyUrl: body.spotifyUrl || null,
      previewUrl: body.previewUrl || null,
      albumArt: body.albumArt || null,

      images: body.images || [],
    },
  });

  return NextResponse.json(capsule, { status: 201 });
}