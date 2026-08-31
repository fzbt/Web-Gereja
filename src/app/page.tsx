"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { Navbar } from "@/components/church/navbar";
import { Footer } from "@/components/church/footer";
import { LandingPage } from "@/components/church/pages/landing-page";
import { LoginPage } from "@/components/church/pages/login-page";
import { DashboardPage } from "@/components/church/pages/dashboard-page";
import { KegiatanManagePage } from "@/components/church/pages/kegiatan-manage-page";
import { KegiatanListPage } from "@/components/church/pages/kegiatan-list-page";
import { CoolPage } from "@/components/church/pages/cool-page";
import { PelayananPage } from "@/components/church/pages/pelayanan-page";
import { PersembahanPage } from "@/components/church/pages/persembahan-page";
import { ProfilePage } from "@/components/church/pages/profile-page";
import { SettingsPage } from "@/components/church/pages/settings-page";

export default function Home() {
  const {
    page,
    user,
    loadingAuth,
    setUser,
    setLoadingAuth,
    setPage,
  } = useAppStore();

  // check session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {})
      .finally(() => setLoadingAuth(false));
  }, [setUser, setLoadingAuth]);

  // proteksi halaman admin
  useEffect(() => {
    if (loadingAuth) return;
    const adminPages = ["dashboard", "kegiatan-manage", "settings"];
    if (adminPages.includes(page) && (!user || user.role !== "ADMIN")) {
      setPage("login");
    }
    const authPages = ["profile"];
    if (authPages.includes(page) && !user) {
      setPage("login");
    }
  }, [page, user, loadingAuth, setPage]);

  // halaman login tidak pakai navbar/footer
  if (page === "login") {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        {loadingAuth ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        ) : (
          <LoginPage />
        )}
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {loadingAuth ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        ) : (
          <>
            {page === "home" && <LandingPage />}
            {page === "kegiatan-list" && <KegiatanListPage />}
            {page === "cool" && <CoolPage />}
            {page === "pelayanan" && <PelayananPage />}
            {page === "persembahan" && <PersembahanPage />}
            {page === "dashboard" && user?.role === "ADMIN" && <DashboardPage />}
            {page === "kegiatan-manage" && user?.role === "ADMIN" && (
              <KegiatanManagePage />
            )}
            {page === "settings" && user?.role === "ADMIN" && <SettingsPage />}
            {page === "profile" && user && <ProfilePage />}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
