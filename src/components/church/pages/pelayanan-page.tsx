"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ExternalLink,
  Music,
  BookOpen,
  HandHeart,
  Users,
  Mic2,
  Camera,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const PELAYANAN_LIST = [
  {
    icon: Music,
    title: "Pelayanan Pujian & Penyembahan",
    desc: "Memimpin jemaat masuk hadirat Tuhan melalui pujian dan penyembahan.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: BookOpen,
    title: "Pelayanan Firman",
    desc: "Membawa firman Tuhan dengan setia dan relevant bagi jemaat.",
    color: "from-sky-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Pelayanan Usher & Welcome",
    desc: "Menyambut jemaat dan tamu dengan kasih, membantu kelancaran ibadah.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Mic2,
    title: "Pelayanan MC",
    desc: "Mengarahkan jalannya ibadah dengan tertib dan penuh sukacita.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Camera,
    title: "Pelayanan Multimedia & Dokumentasi",
    desc: "Menangkap momen ibadah dan mengelola tampilan layar dengan baik.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: HandHeart,
    title: "Pelayanan Doa",
    desc: "Mendoakan jemaat dan menjadi penolong dalam doa syafaat.",
    color: "from-yellow-500 to-amber-500",
  },
];

export function PelayananPage() {
  const { settings, setSettings, setPage } = useAppStore();
  const [loading, setLoading] = useState(() => Object.keys(settings).length === 0);

  useEffect(() => {
    if (Object.keys(settings).length === 0) {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((d) => {
          setSettings(d.settings || {});
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [settings, setSettings]);

  const gformLink = settings.gform_link;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
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
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Pendaftaran Pelayanan
        </h1>
        <p className="text-muted-foreground">
          Tuhan memberkati! Kami percaya setiap jemaat memiliki karunia dan
          panggilan untuk melayani. Pilih bidang pelayanan yang sesuai dengan
          hatimu, dan daftarkan diri melalui formulir online.
        </p>
      </div>

      {/* Banner utama */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 p-8 sm:p-10 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  Formulir Online
                </div>
                <h2 className="text-2xl font-bold">
                  Siap melayani bersama kami?
                </h2>
                <p className="text-white/90 text-sm max-w-md">
                  Klik tombol di bawah untuk mengisi formulir pendaftaran
                  pelayanan. Kami akan menghubungimu segera.
                </p>
              </div>
              {gformLink ? (
                <a href={gformLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-white text-orange-700 hover:bg-amber-50 shadow-lg"
                  >
                    Daftar Sekarang
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Button size="lg" disabled>
                  {loading ? "Memuat..." : "Belum tersedia"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bidang pelayanan */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Bidang Pelayanan</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PELAYANAN_LIST.map((p) => (
            <Card
              key={p.title}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 space-y-3">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white shadow`}
                >
                  <p.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="border-dashed">
        <CardContent className="p-8 text-center space-y-3">
          <h3 className="text-lg font-semibold">Masih ragu bidang apa?</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Tenang, kamu bisa berkonsultasi dengan tim pelayanan kami terlebih
            dahulu. Jangan ragu untuk bertanya - kita satu keluarga di Tuhan!
          </p>
          <a
            href={gformLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              disabled={!gformLink}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Isi Formulir
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
