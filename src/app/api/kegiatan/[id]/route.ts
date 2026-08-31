import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import path from "path";

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
    const existing = await db.kegiatan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const scheduleDay = (formData.get("scheduleDay") as string) || "";
    const scheduleTime = (formData.get("scheduleTime") as string) || "";
    const location = (formData.get("location") as string) || "";
    const category = (formData.get("category") as string) || "UMUM";
    const eventDateStr = formData.get("eventDate") as string | null;
    const expiredAtStr = formData.get("expiredAt") as string | null;
    const imageFile = formData.get("image") as File | null;
    const removeImage = formData.get("removeImage") === "true";

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Nama kegiatan wajib diisi" },
        { status: 400 }
      );
    }

    let imageUrl: string | null | undefined = undefined;
    if (removeImage) {
      // hapus file lama
      if (existing.imageUrl) {
        const oldPath = path.join(process.cwd(), "public", existing.imageUrl);
        try {
          await unlink(oldPath);
        } catch {}
      }
      imageUrl = null;
    } else if (imageFile && imageFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Format gambar harus JPG/PNG/WEBP" },
          { status: 400 }
        );
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran gambar maksimal 5MB" },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      // hapus file lama
      if (existing.imageUrl) {
        const oldPath = path.join(process.cwd(), "public", existing.imageUrl);
        try {
          await unlink(oldPath);
        } catch {}
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `kegiatan-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.webp`;
      const filepath = path.join(uploadDir, filename);

      await sharp(buffer)
        .resize(1200, 800, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toFile(filepath);

      imageUrl = `/uploads/${filename}`;
    }

    const updateData: {
      name: string;
      description: string | null;
      scheduleDay: string | null;
      scheduleTime: string | null;
      location: string | null;
      category: string;
      eventDate: Date | null;
      expiredAt: Date | null;
      imageUrl?: string | null;
    } = {
      name: name.trim(),
      description: description.trim() || null,
      scheduleDay: scheduleDay.trim() || null,
      scheduleTime: scheduleTime.trim() || null,
      location: location.trim() || null,
      category,
      eventDate: eventDateStr ? new Date(eventDateStr) : null,
      expiredAt: expiredAtStr ? new Date(expiredAtStr) : null,
    };
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const kegiatan = await db.kegiatan.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Kegiatan berhasil diperbarui",
      kegiatan,
    });
  } catch (err) {
    console.error("[KEGIATAN_PUT_ERROR]", err);
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
    const existing = await db.kegiatan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    // hapus file gambar
    if (existing.imageUrl) {
      const oldPath = path.join(process.cwd(), "public", existing.imageUrl);
      try {
        await unlink(oldPath);
      } catch {}
    }

    await db.kegiatan.delete({ where: { id } });

    return NextResponse.json({ message: "Kegiatan berhasil dihapus" });
  } catch (err) {
    console.error("[KEGIATAN_DELETE_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
