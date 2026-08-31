# Worklog - GBI Pejaten Village Upperroom Web App

---
Task ID: 1
Agent: Super Z (main)
Task: Membuat aplikasi web gereja GBI Pejaten Village Upperroom dengan stack modern (Next.js 16 + Prisma + Tailwind + shadcn/ui) sebagai adaptasi dari request MERN stack.

Work Log:
- Inisialisasi environment fullstack (Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui)
- Install dependencies: bcryptjs, jsonwebtoken
- Setup Prisma schema lengkap (User, LoginHistory, Kegiatan, CoolCommunity, Setting)
- Buat library auth: hash password (bcrypt), JWT sign/verify, cookie helper
- Buat API routes:
  - /api/auth/login, /logout, /me, /profile (JWT-based)
  - /api/kegiatan (GET, POST + FormData upload gambar via sharp)
  - /api/kegiatan/[id] (PUT, DELETE)
  - /api/cool, /api/cool/[id] (CRUD)
  - /api/login-history (admin only)
  - /api/settings (GET public, PUT admin only)
  - /api/upload (upload QRIS)
  - /api/seed (inisialisasi data)
- Jalankan seeder: admin/admin123, guest/guest123, 6 kegiatan mingguan, 5 COOL, 8 settings
- Buat Zustand store untuk navigasi client-side, auth state, settings
- Buat komponen:
  - Navbar (sticky, dark mode toggle, mobile sidebar via Sheet)
  - Footer (info gereja, jadwal ibadah, social media links)
  - ThemeProvider (next-themes)
- Buat 10 halaman: Landing, Login, Dashboard Admin, Kelola Kegiatan, Daftar Kegiatan, COOL, Pelayanan, Persembahan, Profile, Settings
- Implementasi auto-expire kegiatan (DELETE WHERE expiredAt < now() dijalankan setiap GET /api/kegiatan)
- Implementasi upload gambar dengan sharp (resize + webp optimization)
- Implementasi JWT auth dengan httpOnly cookie (secure, sameSite=lax)
- Validasi: semua API request diuji via Agent Browser (login, CRUD kegiatan, navigasi semua halaman, dark mode toggle, mobile responsive iPhone 14)
- Lint pass tanpa error

Stage Summary:
- Aplikasi gereja lengkap dengan 2 role (Admin, Guest)
- Login terverifikasi: admin/admin123, guest/guest123
- 6 kegiatan mingguan ter-seed (3 Ibadah Raya, 1 Rumah Doa, 2 Doa Pagi)
- 5 COOL dengan redirect WhatsApp (https://wa.me/...)
- Pendaftaran pelayanan via redirect gform (link dapat diubah admin di Settings)
- Persembahan dengan QRIS placeholder (admin bisa upload gambar QRIS)
- Dark mode berfungsi (next-themes)
- Mobile responsive (sidebar sheet di mobile, full nav di desktop)
- Auto-expire kegiatan: kegiatan otomatis terhapus saat expiredAt < now()
- Upload gambar: optimasi via sharp (resize 1200x800, webp quality 80)
- Social media links di footer (Instagram, YouTube, Facebook)
- Edit profile: ganti nama, telepon, password (dengan validasi currentPassword)
- Semua fitur wajib dan bonus terpenuhi
