import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanupExpiredKegiatan, getSession } from "@/lib/session";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await cleanupExpiredKegiatan();
    const kegiatans = await db.kegiatan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ kegiatans });
  } catch (err) {
    console.error("[KEGIATAN_GET_ERROR]", err);
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

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Nama kegiatan wajib diisi" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      // validasi tipe file
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

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `kegiatan-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.webp`;
      const filepath = path.join(uploadDir, filename);

      // optimasi gambar dengan sharp
      await sharp(buffer)
        .resize(1200, 800, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toFile(filepath);

      imageUrl = `/uploads/${filename}`;
    }

    const kegiatan = await db.kegiatan.create({
      data: {
        name: name.trim(),
        description: description.trim() || null,
        scheduleDay: scheduleDay.trim() || null,
        scheduleTime: scheduleTime.trim() || null,
        location: location.trim() || null,
        category,
        imageUrl,
        eventDate: eventDateStr ? new Date(eventDateStr) : null,
        expiredAt: expiredAtStr ? new Date(expiredAtStr) : null,
      },
    });

    return NextResponse.json({
      message: "Kegiatan berhasil ditambahkan",
      kegiatan,
    });
  } catch (err) {
    console.error("[KEGIATAN_POST_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
