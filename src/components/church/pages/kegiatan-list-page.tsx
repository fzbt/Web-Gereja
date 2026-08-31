"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Kegiatan, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Church,
  Clock,
  MapPin,
  CalendarOff,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function KegiatanListPage() {
  const { setPage } = useAppStore();
  const [kegiatans, setKegiatans] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Kegiatan | null>(null);

  useEffect(() => {
    fetch("/api/kegiatan")
      .then((r) => r.json())
      .then((d) => setKegiatans(d.kegiatans || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = kegiatans.filter((k) => {
    if (filter !== "ALL" && k.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        k.name.toLowerCase().includes(q) ||
        (k.description || "").toLowerCase().includes(q) ||
        (k.location || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Kegiatan Gereja</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daftar kegiatan yang bisa diikuti jemaat GBI Pejaten Village Upperroom
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kegiatan..."
            className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Kategori</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5 space-y-3 animate-pulse">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Church className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {kegiatans.length === 0
                ? "Belum ada kegiatan yang dijadwalkan."
                : "Tidak ada kegiatan yang cocok dengan filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((k) => (
            <Card
              key={k.id}
              className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setDetail(k)}
            >
              <div className="aspect-video relative bg-muted">
                {k.imageUrl ? (
                   
                  <img
                    src={k.imageUrl}
                    alt={k.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Church className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge
                    className={
                      CATEGORY_COLORS[k.category] || CATEGORY_COLORS.UMUM
                    }
                  >
                    {CATEGORY_LABELS[k.category] || "Umum"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold line-clamp-1">{k.name}</h3>
                {k.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {k.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  {k.scheduleDay && (
                    <span className="flex items-center gap-1">
                      <CalendarOff className="h-3 w-3" />
                      {k.scheduleDay}
                    </span>
                  )}
                  {k.scheduleTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {k.scheduleTime}
                    </span>
                  )}
                  {k.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{k.location}</span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              {detail.imageUrl && (
                <div className="aspect-video relative -mx-6 -mt-6 mb-2 overflow-hidden">
                  { }
                  <img
                    src={detail.imageUrl}
                    alt={detail.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={cn(
                      CATEGORY_COLORS[detail.category] || CATEGORY_COLORS.UMUM
                    )}
                  >
                    {CATEGORY_LABELS[detail.category] || "Umum"}
                  </Badge>
                </div>
                <DialogTitle>{detail.name}</DialogTitle>
                <DialogDescription>
                  {detail.description || "Tidak ada deskripsi."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                {detail.scheduleDay && (
                  <div className="flex items-start gap-2">
                    <CalendarOff className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hari</p>
                      <p className="text-muted-foreground">{detail.scheduleDay}</p>
                    </div>
                  </div>
                )}
                {detail.scheduleTime && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Jam</p>
                      <p className="text-muted-foreground">{detail.scheduleTime}</p>
                    </div>
                  </div>
                )}
                {detail.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Lokasi</p>
                      <p className="text-muted-foreground">{detail.location}</p>
                    </div>
                  </div>
                )}
                {detail.eventDate && (
                  <div className="flex items-start gap-2">
                    <Church className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tanggal Kegiatan</p>
                      <p className="text-muted-foreground">
                        {format(new Date(detail.eventDate), "EEEE, dd MMMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setDetail(null)}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              >
                Tutup
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {kegiatans.length === 0 && !loading && (
        <div className="text-center pt-6">
          <Button variant="outline" onClick={() => setPage("home")}>
            Kembali ke Beranda
          </Button>
        </div>
      )}
    </div>
  );
}
