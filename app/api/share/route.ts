import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const token = crypto.randomBytes(16).toString("hex");

  const share = await prisma.shareLink.create({
    data: {
      token,
      userId: user.id,
      userName: user.firstName ?? user.username ?? "Traveler",
      type: body.type || "city",
      placeName: body.placeName || null,
      capsuleId: body.capsuleId || null,
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  return NextResponse.json({
    url: `${baseUrl}/share/${share.token}`,
  });
}