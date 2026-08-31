import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin." },
        { status: 403 }
      );
    }

    const history = await db.loginHistory.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ history });
  } catch (err) {
    console.error("[LOGIN_HISTORY_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
