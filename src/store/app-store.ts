"use client";

import { create } from "zustand";

export type PageKey =
  | "home"
  | "login"
  | "dashboard"
  | "kegiatan-manage"
  | "kegiatan-list"
  | "cool"
  | "pelayanan"
  | "persembahan"
  | "profile"
  | "settings";

export type AuthUser = {
  id: string;
  username: string;
  role: string;
  fullName: string | null;
  phone: string | null;
};

type Settings = {
  gform_link?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  qris_image_url?: string;
  church_tagline?: string;
  church_address?: string;
  church_phone?: string;
};

type AppState = {
  // navigation
  page: PageKey;
  setPage: (page: PageKey) => void;

  // auth
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loadingAuth: boolean;
  setLoadingAuth: (v: boolean) => void;

  // settings
  settings: Settings;
  setSettings: (s: Settings) => void;

  // mobile sidebar
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  page: "home",
  setPage: (page) => {
    set({ page });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  user: null,
  setUser: (user) => set({ user }),
  loadingAuth: true,
  setLoadingAuth: (loadingAuth) => set({ loadingAuth }),

  settings: {},
  setSettings: (settings) => set({ settings }),

  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));

/**
 * Format nomor telepon Indonesia ke link WhatsApp.
 * Misal: 6281234567001 -> https://wa.me/6281234567001
 */
export function toWaLink(phone: string): string {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}`;
}

/**
 * Format nomor telepon untuk tampilan (62 -> 0, dst)
 */
export function formatPhone(phone: string): string {
  let p = phone.replace(/[^\d]/g, "");
  if (p.startsWith("62")) {
    p = "0" + p.slice(2);
  }
  if (p.length >= 10) {
    return `${p.slice(0, 4)}-${p.slice(4, 8)}-${p.slice(8)}`;
  }
  return p;
}
