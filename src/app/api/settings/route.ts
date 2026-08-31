import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const DEFAULT_SETTINGS: Record<string, string> = {
  gform_link: "https://forms.gle/placeholder-gbi-pejaten",
  instagram: "https://instagram.com/gbipejatenvillage",
  youtube: "https://youtube.com/@gbipejatenvillage",
  facebook: "https://facebook.com/gbipejatenvillage",
  qris_image_url: "", // akan diisi path upload
  church_tagline: "Menjadi Rumah Doa Bagi Bangsa-Bangsa",
  church_address: "Pejaten Village, Jakarta Selatan",
  church_phone: "081234567890",
};

export async function GET() {
  try {
    const rows = await db.setting.findMany();
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[SETTINGS_GET_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin." },
        { status: 403 }
      );
    }

    const body = await req.json();
    // upsert semua key yang dikirim
    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== "string") continue;
      await db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    const rows = await db.setting.findMany();
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({
      message: "Settings berhasil diperbarui",
      settings,
    });
  } catch (err) {
    console.error("[SETTINGS_PUT_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
