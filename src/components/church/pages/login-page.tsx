"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church, LogIn, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LoginPage() {
  const { setUser, setPage, user } = useAppStore();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // kalau sudah login, redirect otomatis
  useEffect(() => {
    if (user) {
      setPage(user.role === "ADMIN" ? "dashboard" : "home");
    }
  }, [user, setPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        toast({
          title: "Login gagal",
          description: data.error || "Periksa kembali username & password",
          variant: "destructive",
        });
        return;
      }
      setUser(data.user);
      toast({
        title: "Selamat datang!",
        description: `Halo ${data.user.fullName || data.user.username}, login berhasil.`,
      });
      setPage(data.user.role === "ADMIN" ? "dashboard" : "home");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900" />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-300/30 dark:bg-amber-700/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-300/30 dark:bg-orange-700/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPage("home")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke beranda
        </Button>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-3 pb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
              <Church className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl">Login Jemaat</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                GBI Pejaten Village Upperroom
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Masuk
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/60 space-y-3">
              <p className="text-xs text-center text-muted-foreground">
                Akun demo (seeder sudah dijalankan otomatis):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-muted/50 p-2 text-xs">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    Admin
                  </p>
                  <p className="text-muted-foreground">admin / admin123</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2 text-xs">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Guest
                  </p>
                  <p className="text-muted-foreground">guest / guest123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
