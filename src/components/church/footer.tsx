"use client";

import { Instagram, Youtube, Facebook, Phone, MapPin } from "lucide-react";
import { useAppStore, formatPhone } from "@/store/app-store";
import { useEffect } from "react";

export function Footer() {
  const { settings, setSettings } = useAppStore();

  useEffect(() => {
    if (Object.keys(settings).length === 0) {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((d) => setSettings(d.settings || {}))
        .catch(() => {});
    }
  }, [settings, setSettings]);

  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-950 dark:to-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-bold">GBI PEJATEN VILLAGE</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Upperroom
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            &ldquo;{settings.church_tagline || "Menjadi Rumah Doa Bagi Bangsa-Bangsa"}&rdquo;
          </p>
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Lokasi</h4>
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{settings.church_address || "Pejaten Village, Jakarta Selatan"}</span>
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{formatPhone(settings.church_phone || "081234567890")}</span>
          </p>
        </div>

        {/* Jadwal Ibadah */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Jadwal Ibadah</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Minggu: 09:00, 13:00, 16:00</li>
            <li>Kamis (Rumah Doa): 19:00</li>
            <li>Senin &amp; Sabtu (Doa Pagi): 05:00-06:00</li>
          </ul>
        </div>

        {/* Sosmed */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Ikuti Kami</h4>
          <div className="flex items-center gap-2">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GBI Pejaten Village Upperroom. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
