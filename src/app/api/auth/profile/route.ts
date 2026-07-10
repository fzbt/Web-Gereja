import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { AUTH_COOKIE_NAME, verifyToken, hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        role: true,
        fullName: true,
        phone: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[PROFILE_GET_ERROR]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, currentPassword, newPassword } = body;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const updateData: {
      fullName?: string | null;
      phone?: string | null;
      password?: string;
    } = {};

    if (typeof fullName === "string") updateData.fullName = fullName.trim() || null;
    if (typeof phone === "string") updateData.phone = phone.trim() || null;

    // ganti password hanya jika currentPassword valid
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Password saat ini wajib diisi untuk mengganti password" },
          { status: 400 }
        );
      }
      const bcrypt = await import("bcryptjs");
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: "Password saat ini salah" },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password baru minimal 6 karakter" },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(newPassword);
    }

    const updated = await db.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        fullName: true,
        phone: true,
      },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      user: updated,
    });
  } catch (err) {
    console.error("[PROFILE_PUT_ERROR]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
