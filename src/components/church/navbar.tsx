"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppStore, PageKey } from "@/store/app-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; page: PageKey; guestOnly?: boolean }[] = [
  { label: "Beranda", page: "home" },
  { label: "Kegiatan", page: "kegiatan-list" },
  { label: "COOL", page: "cool" },
  { label: "Pendaftaran Pelayanan", page: "pelayanan" },
  { label: "Persembahan", page: "persembahan" },
];

const ADMIN_ITEMS: { label: string; page: PageKey }[] = [
  { label: "Dashboard", page: "dashboard" },
  { label: "Kelola Kegiatan", page: "kegiatan-manage" },
  { label: "Pengaturan", page: "settings" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, page, setPage, setUser } = useAppStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setPage("home");
  };

  const go = (p: PageKey) => {
    setPage(p);
    setOpen(false);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 shrink-0"
          aria-label="Beranda GBI Pejaten Village Upperroom"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold shadow-md">
            U
          </div>
          <div className="hidden sm:flex flex-col leading-tight text-left">
            <span className="text-sm font-bold tracking-tight">
              GBI PEJATEN VILLAGE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Upperroom
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4 flex-1">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.page}
              variant={page === item.page ? "secondary" : "ghost"}
              size="sm"
              onClick={() => go(item.page)}
              className={cn(
                "text-sm",
                page === item.page && "bg-secondary"
              )}
            >
              {item.label}
            </Button>
          ))}
          {isAdmin &&
            ADMIN_ITEMS.map((item) => (
              <Button
                key={item.page}
                variant={page === item.page ? "secondary" : "ghost"}
                size="sm"
                onClick={() => go(item.page)}
                className={cn(
                  "text-sm",
                  page === item.page && "bg-secondary"
                )}
              >
                {item.label}
              </Button>
            ))}
        </nav>

        <div className="ml-auto lg:ml-0 flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            className="h-9 w-9"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Profile / Login */}
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => go("profile")}
              className="hidden sm:flex gap-2"
            >
              <UserIcon className="h-4 w-4" />
              <span className="max-w-[100px] truncate">
                {user.fullName || user.username}
              </span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => go("login")}
              className="hidden sm:flex bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              Login
            </Button>
          )}

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
              className="h-9 w-9 hidden sm:flex"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xs">
                    U
                  </div>
                  GBI Pejaten Village
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-2">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.page}
                    variant={page === item.page ? "secondary" : "ghost"}
                    onClick={() => go(item.page)}
                    className="justify-start"
                  >
                    {item.label}
                  </Button>
                ))}
                {isAdmin && (
                  <>
                    <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase text-muted-foreground">
                      Menu Admin
                    </div>
                    {ADMIN_ITEMS.map((item) => (
                      <Button
                        key={item.page}
                        variant={page === item.page ? "secondary" : "ghost"}
                        onClick={() => go(item.page)}
                        className="justify-start"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </>
                )}
                <div className="my-3 h-px bg-border" />
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => go("profile")}
                      className="justify-start gap-2"
                    >
                      <UserIcon className="h-4 w-4" />
                      {user.fullName || user.username}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start gap-2 text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => go("login")}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  >
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
