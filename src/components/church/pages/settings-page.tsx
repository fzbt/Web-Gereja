"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Settings2,
  Save,
  ArrowLeft,
  Link2,
  Instagram,
  Youtube,
  Facebook,
  Phone,
  MapPin,
  Quote,
  Loader2,
} from "lucide-react";

export function SettingsPage() {
  const { user, setPage, settings, setSettings } = useAppStore();
  const { toast } = useToast();
  const [form, setForm] = useState({
    gform_link: "",
    instagram: "",
    youtube: "",
    facebook: "",
    church_tagline: "",
    church_address: "",
    church_phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setPage("home");
      return;
    }
    setForm({
      gform_link: settings.gform_link || "",
      instagram: settings.instagram || "",
      youtube: settings.youtube || "",
      facebook: settings.facebook || "",
      church_tagline: settings.church_tagline || "",
      church_address: settings.church_address || "",
      church_phone: settings.church_phone || "",
    });
    if (Object.keys(settings).length === 0) {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((d) => setSettings(d.settings || {}))
        .catch(() => {});
    }
  }, [user, setPage, settings, setSettings]);

  if (!user || user.role !== "ADMIN") return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      setSettings(data.settings);
      toast({ title: "Pengaturan disimpan" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setPage("dashboard")}
        className="-ml-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Dashboard
      </Button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Settings2 className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          Pengaturan Gereja
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola link formulir pelayanan, sosial media, dan info kontak gereja.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Link & Sosmed */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Link Eksternal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gform_link">Link Google Form Pendaftaran Pelayanan</Label>
              <Input
                id="gform_link"
                value={form.gform_link}
                onChange={(e) =>
                  setForm({ ...form, gform_link: e.target.value })
                }
                placeholder="https://forms.gle/xxxxx"
              />
              <p className="text-[11px] text-muted-foreground">
                Link akan dituju saat user klik tombol &ldquo;Daftar&rdquo; di halaman
                pelayanan.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-1">
                <Instagram className="h-3.5 w-3.5" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-1">
                <Youtube className="h-3.5 w-3.5" />
                YouTube
              </Label>
              <Input
                id="youtube"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                placeholder="https://youtube.com/@..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-1">
                <Facebook className="h-3.5 w-3.5" />
                Facebook
              </Label>
              <Input
                id="facebook"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Info Gereja */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Info Gereja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="church_tagline" className="flex items-center gap-1">
                <Quote className="h-3.5 w-3.5" />
                Tagline / Visi Gereja
              </Label>
              <Textarea
                id="church_tagline"
                value={form.church_tagline}
                onChange={(e) =>
                  setForm({ ...form, church_tagline: e.target.value })
                }
                placeholder="Menjadi Rumah Doa Bagi Bangsa-Bangsa"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="church_address">Alamat Gereja</Label>
              <Input
                id="church_address"
                value={form.church_address}
                onChange={(e) =>
                  setForm({ ...form, church_address: e.target.value })
                }
                placeholder="Pejaten Village, Jakarta Selatan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="church_phone" className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                Nomor Telepon / WhatsApp Gereja
              </Label>
              <Input
                id="church_phone"
                value={form.church_phone}
                onChange={(e) =>
                  setForm({ ...form, church_phone: e.target.value })
                }
                placeholder="081234567890"
              />
            </div>
          </CardContent>
        </Card>

        {/* Info QRIS */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">QRIS Persembahan:</span>{" "}
              Upload gambar QRIS langsung dari halaman{" "}
              <button
                type="button"
                onClick={() => setPage("persembahan")}
                className="text-amber-700 dark:text-amber-300 font-medium underline underline-offset-2"
              >
                Persembahan
              </button>{" "}
              (khusus admin).
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
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
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
