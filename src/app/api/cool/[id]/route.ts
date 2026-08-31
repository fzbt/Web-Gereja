import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await db.coolCommunity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "COOL tidak ditemukan" },
        { status: 404 }
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

    const cool = await db.coolCommunity.update({
      where: { id },
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
      message: "COOL berhasil diperbarui",
      cool,
    });
  } catch (err) {
    console.error("[COOL_PUT_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await db.coolCommunity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "COOL tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.coolCommunity.delete({ where: { id } });

    return NextResponse.json({ message: "COOL berhasil dihapus" });
  } catch (err) {
    console.error("[COOL_DELETE_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
