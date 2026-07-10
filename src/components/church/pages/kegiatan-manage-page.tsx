"use client";

import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/app-store";
import { Kegiatan, CATEGORY_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  Church,
  Clock,
  MapPin,
  CalendarOff,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = [
  { value: "IBADAH_RAYA", label: "Ibadah Raya" },
  { value: "RUMAH_DOA", label: "Rumah Doa" },
  { value: "DOA_PAGI", label: "Doa Pagi" },
  { value: "UMUM", label: "Umum" },
];

type FormData = {
  name: string;
  description: string;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  category: string;
  eventDate: string;
  expiredAt: string;
  image: File | null;
  imageUrl: string | null;
  removeImage: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  scheduleDay: "",
  scheduleTime: "",
  location: "",
  category: "UMUM",
  eventDate: "",
  expiredAt: "",
  image: null,
  imageUrl: null,
  removeImage: false,
};

export function KegiatanManagePage() {
  const { setPage, user } = useAppStore();
  const { toast } = useToast();
  const [kegiatans, setKegiatans] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      setPage("home");
      return;
    }
    loadKegiatan();
  }, [user, setPage]);

  const loadKegiatan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kegiatan");
      const data = await res.json();
      setKegiatans(data.kegiatans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (k: Kegiatan) => {
    setForm({
      name: k.name,
      description: k.description || "",
      scheduleDay: k.scheduleDay || "",
      scheduleTime: k.scheduleTime || "",
      location: k.location || "",
      category: k.category,
      eventDate: k.eventDate
        ? format(new Date(k.eventDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      expiredAt: k.expiredAt
        ? format(new Date(k.expiredAt), "yyyy-MM-dd'T'HH:mm")
        : "",
      image: null,
      imageUrl: k.imageUrl,
      removeImage: false,
    });
    setEditingId(k.id);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, image: file, imageUrl: null, removeImage: false }));
    }
  };

  const removePreview = () => {
    setForm((f) => ({
      ...f,
      image: null,
      imageUrl: null,
      removeImage: true,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({
        title: "Validasi gagal",
        description: "Nama kegiatan wajib diisi",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("scheduleDay", form.scheduleDay);
      fd.append("scheduleTime", form.scheduleTime);
      fd.append("location", form.location);
      fd.append("category", form.category);
      fd.append("eventDate", form.eventDate);
      fd.append("expiredAt", form.expiredAt);
      if (form.image) fd.append("image", form.image);
      if (form.removeImage) fd.append("removeImage", "true");

      const url = editingId
        ? `/api/kegiatan/${editingId}`
        : "/api/kegiatan";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Gagal menyimpan",
          description: data.error || "Terjadi kesalahan",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: editingId ? "Kegiatan diperbarui" : "Kegiatan ditambahkan",
        description: data.kegiatan.name,
      });
      setDialogOpen(false);
      await loadKegiatan();
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/kegiatan/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Gagal menghapus",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Kegiatan dihapus" });
      setDeleteId(null);
      await loadKegiatan();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Kelola Kegiatan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tambah, edit, atau hapus kegiatan gereja. Kegiatan akan otomatis
            terhapus setelah tanggal expired.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah Kegiatan
        </Button>
      </div>

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
      ) : kegiatans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Church className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Belum ada kegiatan.</p>
            <Button onClick={openCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Kegiatan Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kegiatans.map((k) => (
            <Card key={k.id} className="overflow-hidden border-0 shadow-sm">
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
                  <Badge className="bg-background/90 backdrop-blur text-foreground">
                    {CATEGORY_LABELS[k.category] || "Umum"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1">{k.name}</h3>
                {k.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {k.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
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
                      {k.location}
                    </span>
                  )}
                </div>
                {k.expiredAt && (
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 pt-1">
                    Auto-hapus: {format(new Date(k.expiredAt), "dd MMM yyyy, HH:mm")}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(k)}
                    className="flex-1"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(k.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </DialogTitle>
            <DialogDescription>
              Isi detail kegiatan. Field dengan tanda * wajib diisi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Gambar Kegiatan</Label>
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-border bg-muted/30">
                {form.image ? (
                  <div className="relative h-full w-full">
                    { }
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePreview}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 hover:bg-background shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : form.imageUrl ? (
                  <div className="relative h-full w-full">
                    { }
                    <img
                      src={form.imageUrl}
                      alt="Current"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePreview}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 hover:bg-background shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-full w-full flex-col items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <ImagePlus className="h-8 w-8 mb-2" />
                    <p className="text-xs">Klik untuk upload (max 5MB)</p>
                    <p className="text-[10px] mt-0.5">JPG / PNG / WEBP</p>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Kegiatan *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Ibadah Raya - Sesi 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Penjelasan singkat tentang kegiatan"
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Contoh: Main Sanctuary"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="scheduleDay">Hari</Label>
                <Input
                  id="scheduleDay"
                  value={form.scheduleDay}
                  onChange={(e) =>
                    setForm({ ...form, scheduleDay: e.target.value })
                  }
                  placeholder="Contoh: Minggu / Senin & Sabtu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleTime">Jam</Label>
                <Input
                  id="scheduleTime"
                  value={form.scheduleTime}
                  onChange={(e) =>
                    setForm({ ...form, scheduleTime: e.target.value })
                  }
                  placeholder="Contoh: 09:00 / 05:00-06:00"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Tanggal &amp; Jam Kegiatan</Label>
                <Input
                  id="eventDate"
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiredAt">
                  Tanggal Expired (Auto-hapus)
                </Label>
                <Input
                  id="expiredAt"
                  type="datetime-local"
                  value={form.expiredAt}
                  onChange={(e) =>
                    setForm({ ...form, expiredAt: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
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
                ) : editingId ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Kegiatan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kegiatan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kegiatan dan gambar terkait
              akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
