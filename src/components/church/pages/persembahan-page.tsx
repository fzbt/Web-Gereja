"use client";

import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  HandHeart,
  QrCode,
  ArrowLeft,
  ImagePlus,
  Loader2,
  Heart,
  ShieldCheck,
} from "lucide-react";

export function PersembahanPage() {
  const { settings, setSettings, user, setPage } = useAppStore();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (Object.keys(settings).length === 0) {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((d) => setSettings(d.settings || {}))
        .catch(() => {});
    }
  }, [settings, setSettings]);

  const isAdmin = user?.role === "ADMIN";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("purpose", "qris");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Gagal upload",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      // refresh settings
      const sres = await fetch("/api/settings");
      const sdata = await sres.json();
      setSettings(sdata.settings || {});
      toast({ title: "QRIS berhasil diperbarui" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal upload gambar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const qrisUrl = settings.qris_image_url;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setPage("home")}
        className="-ml-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Beranda
      </Button>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
          <HandHeart className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Persembahan</h1>
        <p className="text-muted-foreground">
          &ldquo;Setiap orang hendaklah memberikan menurut kerelaan hatinya,
          jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi
          orang yang memberi dengan sukacita.&rdquo;{" "}
          <span className="text-xs italic">(2 Korintus 9:7)</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* QRIS */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6 sm:p-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-semibold">Scan QRIS</h2>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Aktif
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan kode QRIS di bawah ini menggunakan aplikasi mobile banking
              atau e-wallet apapun.
            </p>

            <div className="mx-auto max-w-[280px] aspect-square rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 p-4 flex items-center justify-center">
              {qrisUrl ? (
                 
                <img
                  src={qrisUrl}
                  alt="QRIS Persembahan GBI Pejaten Village Upperroom"
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center space-y-2 text-muted-foreground">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <p className="text-xs">
                    {isAdmin
                      ? "Belum ada QRIS. Upload di bawah."
                      : "QRIS belum tersedia, hubungi admin."}
                  </p>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {qrisUrl ? "Ganti QRIS" : "Upload QRIS"}
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Format JPG/PNG/WEBP, maksimal 5MB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="font-semibold">Jenis Persembahan</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      Persembahan Umum
                    </span>{" "}
                    &mdash; untuk pekerjaan pelayanan gereja secara umum.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      Persepuluhan
                    </span>{" "}
                    &mdash; sesuai perintah Tuhan dalam Alkitab.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      Persembahan Syukur
                    </span>{" "}
                    &mdash; ungkapan syukur atas berkat Tuhan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      Persembahan Misi
                    </span>{" "}
                    &mdash; untuk pekerjaan misi penginjilan.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Pertanyaan?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Untuk konfirmasi persembahan atau pertanyaan lainnya, silakan
                hubungi bendahara gereja melalui nomor{" "}
                <a
                  href={`https://wa.me/${(settings.church_phone || "081234567890").replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 dark:text-amber-300 font-medium underline underline-offset-2"
                >
                  {settings.church_phone || "081234567890"}
                </a>
                .
              </p>
              <p className="text-xs italic text-muted-foreground">
                &ldquo;Hendaklah kamu melayani sesama sebagai pelayan-pelayan
                yang baik.&rdquo; &mdash; 1 Petrus 4:10
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
