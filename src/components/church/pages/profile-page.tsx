"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export function ProfilePage() {
  const { user, setUser, setPage } = useAppStore();
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setPage("login");
      return;
    }
    setForm((f) => ({
      ...f,
      fullName: user.fullName || "",
      phone: user.phone || "",
    }));
  }, [user, setPage]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // validasi password
    if (form.newPassword) {
      if (!form.currentPassword) {
        toast({
          title: "Validasi gagal",
          description: "Password saat ini wajib diisi untuk mengganti password",
          variant: "destructive",
        });
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        toast({
          title: "Validasi gagal",
          description: "Konfirmasi password tidak cocok",
          variant: "destructive",
        });
        return;
      }
      if (form.newPassword.length < 6) {
        toast({
          title: "Validasi gagal",
          description: "Password baru minimal 6 karakter",
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          currentPassword: form.currentPassword || undefined,
          newPassword: form.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Gagal menyimpan",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      setUser(data.user);
      setForm((f) => ({
        ...f,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      toast({
        title: "Profil diperbarui",
        description: "Perubahan berhasil disimpan",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan jaringan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setPage(user.role === "ADMIN" ? "dashboard" : "home")}
        className="-ml-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl font-bold shadow-lg">
          {(user.fullName || user.username).charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.fullName || user.username}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">@{user.username}</span>
            <Badge
              className={
                user.role === "ADMIN"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
              }
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              {user.role === "ADMIN" ? "Administrator" : "Jemaat"}
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Info dasar */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={user.username}
                  disabled
                  className="pl-10 bg-muted/50"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Username tidak dapat diubah.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                placeholder="Nama lengkap Anda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ganti password */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Ganti Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Kosongkan jika tidak ingin mengganti password.
            </p>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPwd.current ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPwd((s) => ({ ...s, current: !s.current }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPwd.new ? "text" : "password"}
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    placeholder="Min. 6 karakter"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd((s) => ({ ...s, new: !s.new }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPwd.confirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    placeholder="Ulangi password baru"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd((s) => ({ ...s, confirm: !s.confirm }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage(user.role === "ADMIN" ? "dashboard" : "home")}
            disabled={saving}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
