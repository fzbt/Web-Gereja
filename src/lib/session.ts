import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export type SessionUser = {
  id: string;
  username: string;
  role: string;
  fullName: string | null;
  phone: string | null;
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
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
  return user;
}

export async function requireAdmin(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/**
 * Hapus kegiatan yang sudah expired secara otomatis.
 * Dipanggil setiap kali ada request ke API kegiatan.
 */
export async function cleanupExpiredKegiatan() {
  try {
    const now = new Date();
    await db.kegiatan.deleteMany({
      where: {
        expiredAt: { lt: now },
      },
    });
  } catch (err) {
    console.error("[CLEANUP_EXPIRED_ERROR]", err);
  }
}
