import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  try {
    const cools = await db.coolCommunity.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ cools });
  } catch (err) {
    console.error("[COOL_GET_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, leader, phone, area, meetDay, meetTime } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Nama COOL wajib diisi" },
        { status: 400 }
      );
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Nomor telepon wajib diisi" },
        { status: 400 }
      );
    }

    const cool = await db.coolCommunity.create({
      data: {
        name: name.trim(),
        leader: leader?.trim() || null,
        phone: phone.trim(),
        area: area?.trim() || null,
        meetDay: meetDay?.trim() || null,
        meetTime: meetTime?.trim() || null,
      },
    });

    return NextResponse.json({
      message: "COOL berhasil ditambahkan",
      cool,
    });
  } catch (err) {
    console.error("[COOL_POST_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
