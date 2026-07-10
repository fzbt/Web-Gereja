"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { LoginHistoryItem, Kegiatan, CoolCommunity } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ScrollArea,
} from "@/components/ui/scroll-area";
import {
  Activity,
  Users,
  CalendarCheck,
  LogIn,
  CheckCircle2,
  XCircle,
  Settings2,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";

export function DashboardPage() {
  const { user, setPage } = useAppStore();
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [stats, setStats] = useState({
    kegiatan: 0,
    cool: 0,
    successfulLogins: 0,
    failedLogins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/login-history").then((r) => r.json()),
      fetch("/api/kegiatan").then((r) => r.json()),
      fetch("/api/cool").then((r) => r.json()),
    ])
      .then(([histRes, kegRes, coolRes]) => {
        setHistory(histRes.history || []);
        const kegiatans: Kegiatan[] = kegRes.kegiatans || [];
        const cools: CoolCommunity[] = coolRes.cools || [];
        const successful = (histRes.history || []).filter(
          (h: LoginHistoryItem) => h.success
        ).length;
        const failed = (histRes.history || []).filter(
          (h: LoginHistoryItem) => !h.success
        ).length;
        setStats({
          kegiatan: kegiatans.length,
          cool: cools.length,
          successfulLogins: successful,
          failedLogins: failed,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Kegiatan",
      value: stats.kegiatan,
      icon: CalendarCheck,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      onClick: () => setPage("kegiatan-manage"),
    },
    {
      label: "Komunitas COOL",
      value: stats.cool,
      icon: Users,
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      onClick: () => setPage("cool"),
    },
    {
      label: "Login Berhasil",
      value: stats.successfulLogins,
      icon: CheckCircle2,
      color:
        "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    },
    {
      label: "Login Gagal",
      value: stats.failedLogins,
      icon: XCircle,
      color:
        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selamat datang kembali,{" "}
            <span className="font-medium">{user?.fullName || user?.username}</span>
          </p>
        </div>
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 w-fit">
          <Activity className="h-3 w-3 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card
            key={s.label}
            className={`border-0 shadow-sm ${s.onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
            onClick={s.onClick}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {loading ? "..." : s.value}
                  </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card
          className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setPage("kegiatan-manage")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Kelola Kegiatan</h3>
              <p className="text-xs text-muted-foreground">
                Tambah, edit, atau hapus kegiatan
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setPage("cool")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Kelola COOL</h3>
              <p className="text-xs text-muted-foreground">
                Daftar komunitas Community of Love
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setPage("settings")}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Pengaturan</h3>
              <p className="text-xs text-muted-foreground">
                Link gform, sosmed, QRIS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Login */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <LogIn className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Riwayat Login
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            50 login terakhir (berhasil &amp; gagal)
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              Belum ada riwayat login.
            </div>
          ) : (
            <ScrollArea className="h-[420px]">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">IP</TableHead>
                    <TableHead className="hidden lg:table-cell">User Agent</TableHead>
                    <TableHead>Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>
                        {h.success ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-600" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {h.user.fullName || h.user.username}
                        <div className="text-xs text-muted-foreground">
                          @{h.user.username}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={
                            h.user.role === "ADMIN"
                              ? "border-amber-400 text-amber-700 dark:text-amber-300"
                              : ""
                          }
                        >
                          {h.user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {h.ip || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                        {h.userAgent || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(h.createdAt), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
