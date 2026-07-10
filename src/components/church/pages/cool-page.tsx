"use client";

import { useEffect, useState } from "react";
import { useAppStore, toWaLink, formatPhone } from "@/store/app-store";
import { CoolCommunity } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Users,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Plus,
  Pencil,
  Trash2,
  User,
  Loader2,
} from "lucide-react";

export function CoolPage() {
  const { user, setPage } = useAppStore();
  const { toast } = useToast();
  const [cools, setCools] = useState<CoolCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    leader: "",
    phone: "",
    area: "",
    meetDay: "",
    meetTime: "",
  });

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cool");
      const data = await res.json();
      setCools(data.cools || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({ name: "", leader: "", phone: "", area: "", meetDay: "", meetTime: "" });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (c: CoolCommunity) => {
    setForm({
      name: c.name,
      leader: c.leader || "",
      phone: c.phone,
      area: c.area || "",
      meetDay: c.meetDay || "",
      meetTime: c.meetTime || "",
    });
    setEditingId(c.id);
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({
        title: "Validasi gagal",
        description: "Nama dan nomor telepon wajib diisi",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/cool/${editingId}` : "/api/cool";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
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
      toast({
        title: editingId ? "COOL diperbarui" : "COOL ditambahkan",
        description: form.name,
      });
      setDialogOpen(false);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/cool/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Gagal menghapus",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "COOL dihapus" });
      setDeleteId(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            Komunitas COOL
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Community of Love &mdash; persekutuan sel kecil di berbagai area.
            Klik untuk menghubungi pemimpin COOL via WhatsApp.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openCreate}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah COOL
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5 space-y-3 animate-pulse">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cools.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Belum ada COOL yang terdaftar.</p>
            {!isAdmin && (
              <Button
                variant="outline"
                onClick={() => setPage("home")}
                className="mt-4"
              >
                Kembali ke Beranda
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cools.map((c) => (
            <Card
              key={c.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      {c.leader && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {c.leader}
                        </p>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setDeleteId(c.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-sm">
                  {c.area && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {c.area}
                    </p>
                  )}
                  {(c.meetDay || c.meetTime) && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {c.meetDay}
                      {c.meetDay && c.meetTime && " • "}
                      {c.meetTime}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {formatPhone(c.phone)}
                  </p>
                </div>

                <a
                  href={toWaLink(c.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Hubungi via WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit COOL" : "Tambah COOL"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama COOL *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: COOL Pejaten"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leader">Pemimpin</Label>
              <Input
                id="leader"
                value={form.leader}
                onChange={(e) => setForm({ ...form, leader: e.target.value })}
                placeholder="Nama pemimpin COOL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Format: 6281234567890"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Gunakan format internasional tanpa tanda + (contoh: 628xxx)
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="Lokasi pertemuan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetDay">Hari Pertemuan</Label>
                <Input
                  id="meetDay"
                  value={form.meetDay}
                  onChange={(e) =>
                    setForm({ ...form, meetDay: e.target.value })
                  }
                  placeholder="Contoh: Jumat"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetTime">Jam Pertemuan</Label>
              <Input
                id="meetTime"
                value={form.meetTime}
                onChange={(e) => setForm({ ...form, meetTime: e.target.value })}
                placeholder="Contoh: 19:30"
              />
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
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingId ? (
                  "Simpan"
                ) : (
                  "Tambah"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus COOL ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
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
