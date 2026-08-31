export type Kegiatan = {
  id: string;
  name: string;
  description: string | null;
  scheduleDay: string | null;
  scheduleTime: string | null;
  location: string | null;
  category: string;
  imageUrl: string | null;
  eventDate: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CoolCommunity = {
  id: string;
  name: string;
  leader: string | null;
  phone: string;
  area: string | null;
  meetDay: string | null;
  meetTime: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginHistoryItem = {
  id: string;
  userId: string;
  ip: string | null;
  userAgent: string | null;
  success: boolean;
  createdAt: string;
  user: {
    username: string;
    fullName: string | null;
    role: string;
  };
};

export type Settings = {
  gform_link?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  qris_image_url?: string;
  church_tagline?: string;
  church_address?: string;
  church_phone?: string;
};

export const CATEGORY_LABELS: Record<string, string> = {
  IBADAH_RAYA: "Ibadah Raya",
  RUMAH_DOA: "Rumah Doa",
  DOA_PAGI: "Doa Pagi",
  UMUM: "Umum",
};

export const CATEGORY_COLORS: Record<string, string> = {
  IBADAH_RAYA:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  RUMAH_DOA:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  DOA_PAGI:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  UMUM: "bg-stone-100 text-stone-800 dark:bg-stone-800/60 dark:text-stone-200",
};
