"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Kegiatan, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Church,
  Clock,
  MapPin,
  Heart,
  Users,
  HandHeart,
  ArrowRight,
} from "lucide-react";

export function LandingPage() {
  const { setPage, settings } = useAppStore();
  const [kegiatans, setKegiatans] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kegiatan")
      .then((r) => r.json())
      .then((d) => setKegiatans(d.kegiatans || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featuredKegiatan = kegiatans.filter((k) => k.imageUrl).slice(0, 6);
  const upcomingKegiatan = kegiatans.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-300/30 dark:bg-amber-700/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-300/30 dark:bg-orange-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge
                variant="outline"
                className="bg-background/60 backdrop-blur border-amber-300/50 text-amber-700 dark:text-amber-300"
              >
                <Church className="h-3 w-3 mr-1" />
                Selamat Datang di Rumah Tuhan
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-amber-700 via-orange-700 to-amber-800 dark:from-amber-300 dark:via-orange-300 dark:to-amber-200 bg-clip-text text-transparent">
                GBI Pejaten Village Upperroom
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                {settings.church_tagline ||
                  "Menjadi Rumah Doa Bagi Bangsa-Bangsa"}{" "}
                &mdash; tempat persekutuan, penyembahan, dan pertumbuhan iman
                bersama keluarga besar Allah.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => setPage("kegiatan-list")}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  Lihat Kegiatan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setPage("cool")}
                  className="border-amber-400 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gabung COOL
                </Button>
              </div>
            </div>

            {/* Hero card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-2xl opacity-20" />
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50 dark:from-stone-900 dark:to-stone-800">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                      <Church className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Ibadah Minggu</h3>
                      <p className="text-xs text-muted-foreground">
                        3 Sesi setiap hari Minggu
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { time: "09:00", label: "Sesi Pertama" },
                      { time: "13:00", label: "Sesi Kedua" },
                      { time: "16:00", label: "Sesi Ketiga" },
                    ].map((s) => (
                      <div
                        key={s.time}
                        className="flex items-center justify-between rounded-xl bg-background/80 backdrop-blur p-3 border border-amber-200/50 dark:border-amber-900/30"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-sm font-medium">{s.label}</span>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                          {s.time}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Main Sanctuary - Pejaten Village
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setPage("kegiatan-list")}
            className="group rounded-2xl border border-border bg-card p-5 text-left hover:border-amber-400 hover:shadow-lg transition-all"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Church className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Kegiatan Gereja</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Jadwal ibadah &amp; doa
            </p>
          </button>

          <button
            onClick={() => setPage("cool")}
            className="group rounded-2xl border border-border bg-card p-5 text-left hover:border-amber-400 hover:shadow-lg transition-all"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Komunitas COOL</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Community of Love
            </p>
          </button>

          <button
            onClick={() => setPage("pelayanan")}
            className="group rounded-2xl border border-border bg-card p-5 text-left hover:border-amber-400 hover:shadow-lg transition-all"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Pelayanan</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Daftar jadi pelayan
            </p>
          </button>

          <button
            onClick={() => setPage("persembahan")}
            className="group rounded-2xl border border-border bg-card p-5 text-left hover:border-amber-400 hover:shadow-lg transition-all"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              <HandHeart className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Persembahan</h3>
            <p className="text-xs text-muted-foreground mt-1">
              QRIS &amp; info rekening
            </p>
          </button>
        </div>
      </section>

      {/* Carousel Kegiatan */}
      {featuredKegiatan.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Galeri Kegiatan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Momen-momen penuh berkat dari kegiatan gereja kami
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage("kegiatan-list")}
              className="hidden sm:flex"
            >
              Lihat semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Carousel
            opts={{ align: "start", loop: featuredKegiatan.length > 2 }}
            className="w-full"
          >
            <CarouselContent>
              {featuredKegiatan.map((k) => (
                <CarouselItem
                  key={k.id}
                  className="sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="overflow-hidden border-0 shadow-md h-full">
                    <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                      {k.imageUrl ? (
                         
                        <img
                          src={k.imageUrl}
                          alt={k.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Church className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={CATEGORY_COLORS[k.category] || CATEGORY_COLORS.UMUM}
                        >
                          {CATEGORY_LABELS[k.category] || "Umum"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{k.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {k.scheduleDay && <span>{k.scheduleDay}</span>}
                        {k.scheduleTime && (
                          <>
                            <span>•</span>
                            <span>{k.scheduleTime}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>
      )}

      {/* Upcoming Kegiatan */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Kegiatan Mendatang</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Jangan lewatkan kegiatan pekan ini
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-3 animate-pulse">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingKegiatan.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center text-muted-foreground">
              Belum ada kegiatan mendatang.
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingKegiatan.map((k) => (
              <Card
                key={k.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      className={
                        CATEGORY_COLORS[k.category] || CATEGORY_COLORS.UMUM
                      }
                    >
                      {CATEGORY_LABELS[k.category] || "Umum"}
                    </Badge>
                    {k.scheduleDay && (
                      <span className="text-xs text-muted-foreground">
                        {k.scheduleDay}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold">{k.name}</h3>
                  {k.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {k.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t border-border/60">
                    {k.scheduleTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {k.scheduleTime}
                      </span>
                    )}
                    {k.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {k.location}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setPage("kegiatan-list")}
            className="border-amber-400 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40"
          >
            Lihat Semua Kegiatan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
