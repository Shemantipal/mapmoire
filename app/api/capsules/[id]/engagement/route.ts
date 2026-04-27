import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [loveCount, comments] = await Promise.all([
    prisma.capsuleReaction.count({
      where: { capsuleId: id },
    }),
    prisma.capsuleComment.findMany({
      where: { capsuleId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return NextResponse.json({ loveCount, comments });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.type === "love") {
    await prisma.capsuleReaction.create({
      data: {
        capsuleId: id,
        emoji: "❤️",
      },
    });

    return NextResponse.json({ ok: true });
  }

  if (body.type === "comment") {
    if (!body.comment?.trim()) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }

    await prisma.capsuleComment.create({
      data: {
        capsuleId: id,
        name: body.name || "Traveler",
        comment: body.comment,
      },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}