import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    // 1. Buat admin & guest user
    const existingAdmin = await db.user.findUnique({
      where: { username: "admin" },
    });
    if (!existingAdmin) {
      await db.user.create({
        data: {
          username: "admin",
          password: await hashPassword("admin123"),
          role: "ADMIN",
          fullName: "Administrator GBI Pejaten",
          phone: "081234567890",
        },
      });
    }

    const existingGuest = await db.user.findUnique({
      where: { username: "guest" },
    });
    if (!existingGuest) {
      await db.user.create({
        data: {
          username: "guest",
          password: await hashPassword("guest123"),
          role: "GUEST",
          fullName: "Tamu Gereja",
          phone: "089876543210",
        },
      });
    }

    // 2. Seed kegiatan mingguan
    const kegiatanCount = await db.kegiatan.count();
    if (kegiatanCount === 0) {
      const now = new Date();
      const nextSunday = new Date(now);
      const day = now.getDay(); // 0 = Sunday
      const diff = (7 - day) % 7;
      nextSunday.setDate(now.getDate() + diff);
      nextSunday.setHours(0, 0, 0, 0);

      const nextThursday = new Date(now);
      const dayThu = now.getDay(); // 4 = Thursday
      const diffThu = (4 - dayThu + 7) % 7;
      nextThursday.setDate(now.getDate() + diffThu);
      nextThursday.setHours(0, 0, 0, 0);

      const nextMonday = new Date(now);
      const dayMon = now.getDay();
      const diffMon = (1 - dayMon + 7) % 7;
      nextMonday.setDate(now.getDate() + diffMon);
      nextMonday.setHours(0, 0, 0, 0);

      const nextSaturday = new Date(now);
      const daySat = now.getDay();
      const diffSat = (6 - daySat + 7) % 7;
      nextSaturday.setDate(now.getDate() + diffSat);
      nextSaturday.setHours(0, 0, 0, 0);

      await db.kegiatan.createMany({
        data: [
          {
            name: "Ibadah Raya - Sesi 1",
            description:
              "Ibadah Raya pertama setiap hari Minggu. Datang lebih awal untuk menikmati persekutuan dan pujian penyembahan.",
            scheduleDay: "Minggu",
            scheduleTime: "09:00",
            location: "Main Sanctuary - Pejaten Village",
            category: "IBADAH_RAYA",
            eventDate: new Date(nextSunday.getTime() + 9 * 60 * 60 * 1000),
            expiredAt: new Date(
              nextSunday.getTime() + 12 * 60 * 60 * 1000
            ),
          },
          {
            name: "Ibadah Raya - Sesi 2",
            description:
              "Ibadah Raya sesi kedua hari Minggu. Tempat yang sama, jam yang berbeda untuk memberi kesempatan semua jemaat hadir.",
            scheduleDay: "Minggu",
            scheduleTime: "13:00",
            location: "Main Sanctuary - Pejaten Village",
            category: "IBADAH_RAYA",
            eventDate: new Date(nextSunday.getTime() + 13 * 60 * 60 * 1000),
            expiredAt: new Date(
              nextSunday.getTime() + 16 * 60 * 60 * 1000
            ),
          },
          {
            name: "Ibadah Raya - Sesi 3",
            description:
              "Ibadah Raya sesi sore hari Minggu. Sesi terakhir untuk hari Minggu.",
            scheduleDay: "Minggu",
            scheduleTime: "16:00",
            location: "Main Sanctuary - Pejaten Village",
            category: "IBADAH_RAYA",
            eventDate: new Date(nextSunday.getTime() + 16 * 60 * 60 * 1000),
            expiredAt: new Date(
              nextSunday.getTime() + 19 * 60 * 60 * 1000
            ),
          },
          {
            name: "Ibadah Rumah Doa",
            description:
              "Persekutuan rumah doa setiap Kamis malam. Saat untuk berdoa, berbagi firman, dan saling menguatkan.",
            scheduleDay: "Kamis",
            scheduleTime: "19:00",
            location: "Ruang Doa - Pejaten Village",
            category: "RUMAH_DOA",
            eventDate: new Date(nextThursday.getTime() + 19 * 60 * 60 * 1000),
            expiredAt: new Date(
              nextThursday.getTime() + 22 * 60 * 60 * 1000
            ),
          },
          {
            name: "Doa Pagi (Senin)",
            description:
              "Doa pagi via Zoom setiap Senin jam 05:00-06:00. Mulai hari dengan Tuhan.",
            scheduleDay: "Senin",
            scheduleTime: "05:00-06:00",
            location: "Zoom Meeting",
            category: "DOA_PAGI",
            eventDate: new Date(nextMonday.getTime() + 5 * 60 * 60 * 1000),
            expiredAt: new Date(
              nextMonday.getTime() + 7 * 60 * 60 * 1000
            ),
          },
          {
            name: "Doa Pagi (Sabtu)",
            description:
              "Doa pagi via Zoom setiap Sabtu jam 05:00-06:00. Saat khusus menyembah dan mendengar Tuhan.",
            scheduleDay: "Sabtu",
            scheduleTime: "05:00-06:00",
            location: "Zoom Meeting",
            category: "DOA_PAGI",
            eventDate: new Date(nextSaturday.getTime() + 5 * 60 * 60 * 1000),
            expiredAt: new Date(
              nextSaturday.getTime() + 7 * 60 * 60 * 1000
            ),
          },
        ],
      });
    }

    // 3. Seed COOL
    const coolCount = await db.coolCommunity.count();
    if (coolCount === 0) {
      await db.coolCommunity.createMany({
        data: [
          {
            name: "COOL Pejaten",
            leader: "Pdt. Yohanes",
            phone: "6281234567001",
            area: "Pejaten, Jakarta Selatan",
            meetDay: "Jumat",
            meetTime: "19:30",
          },
          {
            name: "COOL Pasar Minggu",
            leader: "Sdr. Daniel",
            phone: "6281234567002",
            area: "Pasar Minggu, Jakarta Selatan",
            meetDay: "Sabtu",
            meetTime: "18:00",
          },
          {
            name: "COOL Kebagusan",
            leader: "Sdri. Maria",
            phone: "6281234567003",
            area: "Kebagusan, Jakarta Selatan",
            meetDay: "Jumat",
            meetTime: "19:00",
          },
          {
            name: "COOL Ampera",
            leader: "Sdr. Petrus",
            phone: "6281234567004",
            area: "Ampera, Jakarta Selatan",
            meetDay: "Sabtu",
            meetTime: "19:00",
          },
          {
            name: "COOL Cilandak",
            leader: "Sdr. Andreas",
            phone: "6281234567005",
            area: "Cilandak, Jakarta Selatan",
            meetDay: "Minggu",
            meetTime: "18:00",
          },
        ],
      });
    }

    // 4. Seed settings
    const settingsCount = await db.setting.count();
    if (settingsCount === 0) {
      await db.setting.createMany({
        data: [
          {
            key: "gform_link",
            value: "https://forms.gle/placeholder-gbi-pejaten",
          },
          {
            key: "instagram",
            value: "https://instagram.com/gbipejatenvillage",
          },
          { key: "youtube", value: "https://youtube.com/@gbipejatenvillage" },
          {
            key: "facebook",
            value: "https://facebook.com/gbipejatenvillage",
          },
          { key: "qris_image_url", value: "" },
          {
            key: "church_tagline",
            value: "Menjadi Rumah Doa Bagi Bangsa-Bangsa",
          },
          { key: "church_address", value: "Pejaten Village, Jakarta Selatan" },
          { key: "church_phone", value: "081234567890" },
        ],
      });
    }

    return NextResponse.json({
      message: "Seed berhasil dijalankan",
      credentials: {
        admin: { username: "admin", password: "admin123" },
        guest: { username: "guest", password: "guest123" },
      },
    });
  } catch (err) {
    console.error("[SEED_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server: " + String(err) },
      { status: 500 }
    );
  }
}
