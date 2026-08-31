# GBI Pejaten Village Upperroom — Web Application

A complete church management web application for **GBI Pejaten Village Upperroom**, featuring a board notice system, activity management, community directory, and online giving. Built with modern web technologies for an responsive, mobile-friendly experience.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Authentication & Authorization](#authentication--authorization)
9. [Pages & User Flows](#pages--user-flows)
10. [Configuration](#configuration)
11. [Deployment](#deployment)
12. [Default Credentials](#default-credentials)
13. [Troubleshooting](#troubleshooting)

---

## Overview

This application serves as the digital hub for GBI Pejaten Village Upperroom church. It provides:

- **Public-facing landing page** with church info, service schedules, and activity carousel
- **Member authentication** with two roles (Admin and Guest)
- **Admin dashboard** for managing church activities, communities (COOL), and settings
- **Activity board** with auto-expiring events based on admin-defined expiration dates
- **Community of Love (COOL) directory** with WhatsApp integration for contacting group leaders
- **Online giving (Persembahan)** with QRIS code support
- **Service registration** redirecting to Google Forms
- **Social media integration** in footer (Instagram, YouTube, Facebook)
- **Dark mode** toggle for user preference
- **Fully responsive** mobile-first design

### Weekly Schedule (Default Seeded Data)

| Day | Activity | Time |
|-----|----------|------|
| Sunday | Ibadah Raya — Session 1 | 09:00 |
| Sunday | Ibadah Raya — Session 2 | 13:00 |
| Sunday | Ibadah Raya — Session 3 | 16:00 |
| Thursday | Ibadah Rumah Doa | 19:00 |
| Monday | Doa Pagi (Zoom) | 05:00 – 06:00 |
| Saturday | Doa Pagi (Zoom) | 05:00 – 06:00 |

---

## Features

### Core Features (Required)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Login Page** | Separate from landing page; JWT-based authentication; redirects based on role |
| 2 | **Admin Dashboard** | Statistics cards, login history table (50 latest entries), quick actions |
| 3 | **Landing Page** | Hero section, image carousel of activities, church name display |
| 4 | **Activity Management (Admin)** | Full CRUD for activities; image upload via Multer-equivalent; expiration date setting |
| 5 | **COOL Community Directory** | List of Community of Love groups; click-to-WhatsApp redirect |
| 6 | **Service Registration** | Redirect to Google Form link |
| 7 | **Activity List (User)** | Browse all upcoming activities |

### Bonus Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Online Giving (Persembahan)** | QRIS placeholder with admin upload capability |
| 2 | **Edit Profile** | Update name, phone, and password |
| 3 | **Image Upload** | For activities and QRIS, optimized with sharp |
| 4 | **Dark Mode** | Toggle in navbar (next-themes) |
| 5 | **Responsive Mobile** | Mobile-first design with Tailwind CSS |
| 6 | **Auto-Expire Activities** | Activities auto-delete after expiration date |
| 7 | **Social Media Links** | Instagram, YouTube, Facebook in footer |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework |
| **Language** | TypeScript 5 | Type-safe development |
| **Frontend** | React 19 | UI library |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **UI Components** | shadcn/ui (New York style) | Pre-built accessible components |
| **Icons** | lucide-react | SVG icon library |
| **Database** | Prisma ORM + SQLite | Type-safe database access |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs | Token-based auth with hashed passwords |
| **Image Processing** | sharp | Resize, optimize, convert to WebP |
| **State Management** | Zustand | Lightweight client-side state |
| **Theme** | next-themes | Dark/light mode support |
| **Forms** | react-hook-form + zod | Form handling and validation |
| **Date Handling** | date-fns | Date formatting and manipulation |
| **Carousel** | embla-carousel-react | Activity image carousel |
| **Notifications** | sonner + radix toast | User feedback |

> **Note on MERN adaptation:** The original request specified MERN (MongoDB, Express, React, Node). This implementation uses Next.js (which is React-based) with Prisma ORM (which supports MongoDB, SQLite, PostgreSQL, and more). The architecture follows the same separation of concerns: frontend React components, backend API routes (equivalent to Express controllers), and a database layer. To switch to MongoDB, simply change the Prisma datasource provider from `sqlite` to `mongodb` and update the schema field types accordingly.

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (or Bun runtime)
- **npm** / **yarn** / **bun** package manager

### Installation

1. **Extract the zip file:**
   ```bash
   unzip gbi-pejaten-upperroom.zip -d gbi-pejaten
   cd gbi-pejaten
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   # or
   yarn install
   ```

3. **Configure environment:**
   
   The `.env` file is included with defaults:
   ```env
   DATABASE_URL=file:./db/custom.db
   JWT_SECRET=gbi-pejaten-upperroom-secret-key-2024
   ```
   
   ⚠️ **For production:** Change `JWT_SECRET` to a strong, unique secret.

4. **Initialize database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Seed initial data:**
   
   In a separate terminal (while the dev server is running):
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
   
   Or visit `http://localhost:3000/api/seed` with a POST request using Postman/Insomnia.

7. **Open the application:**
   
   Navigate to `http://localhost:3000` in your browser.

8. **Login with default credentials:**
   - **Admin:** `admin` / `admin123`
   - **Guest:** `guest` / `guest123`

---

## Project Structure

```
gbi-pejaten/
├── prisma/
│   └── schema.prisma              # Database schema (User, LoginHistory, Kegiatan, CoolCommunity, Setting)
│
├── public/
│   ├── logo.svg                   # Church logo
│   ├── robots.txt
│   └── uploads/                   # Auto-created; stores uploaded images (kegiatan, QRIS)
│
├── src/
│   ├── app/
│   │   ├── api/                   # Backend API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts        # POST - Login with JWT
│   │   │   │   ├── logout/route.ts       # POST - Logout (clear cookie)
│   │   │   │   ├── me/route.ts           # GET - Current session
│   │   │   │   └── profile/route.ts      # GET/PUT - User profile
│   │   │   ├── kegiatan/
│   │   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   │   └── [id]/route.ts         # PUT (update), DELETE (remove)
│   │   │   ├── cool/
│   │   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   │   └── [id]/route.ts         # PUT (update), DELETE (remove)
│   │   │   ├── login-history/route.ts    # GET - Admin: login history
│   │   │   ├── settings/route.ts         # GET (public), PUT (admin)
│   │   │   ├── upload/route.ts           # POST - Image upload (sharp)
│   │   │   └── seed/route.ts             # POST - Seed initial data
│   │   │
│   │   ├── globals.css            # Global styles + Tailwind + theme variables
│   │   ├── layout.tsx             # Root layout (ThemeProvider, fonts, metadata)
│   │   └── page.tsx               # Client-side router (renders pages based on state)
│   │
│   ├── components/
│   │   ├── church/
│   │   │   ├── navbar.tsx         # Sticky navbar with dark mode toggle + mobile sidebar
│   │   │   ├── footer.tsx         # Footer with church info + social media
│   │   │   └── pages/             # Application pages
│   │   │       ├── landing-page.tsx          # Home with hero + carousel
│   │   │       ├── login-page.tsx            # JWT login form
│   │   │       ├── dashboard-page.tsx        # Admin dashboard + login history
│   │   │       ├── kegiatan-manage-page.tsx  # CRUD activities (admin)
│   │   │       ├── kegiatan-list-page.tsx    # Browse activities (user)
│   │   │       ├── cool-page.tsx             # COOL community directory
│   │   │       ├── pelayanan-page.tsx        # Service registration
│   │   │       ├── persembahan-page.tsx      # Online giving (QRIS)
│   │   │       ├── profile-page.tsx          # Edit profile + password
│   │   │       └── settings-page.tsx         # Admin settings
│   │   │
│   │   ├── theme-provider.tsx     # next-themes wrapper
│   │   └── ui/                    # shadcn/ui components (button, card, dialog, etc.)
│   │
│   ├── lib/
│   │   ├── auth.ts                # JWT + bcrypt helpers (hashPassword, signToken, verifyToken)
│   │   ├── session.ts             # getSession(), requireAdmin(), cleanupExpiredKegiatan()
│   │   ├── types.ts               # Shared TypeScript types + category labels/colors
│   │   ├── db.ts                  # Prisma client singleton
│   │   └── utils.ts               # cn() utility for class merging
│   │
│   ├── store/
│   │   └── app-store.ts           # Zustand store (navigation, auth, settings)
│   │
│   └── hooks/
│       ├── use-toast.ts           # Toast notifications hook
│       └── use-mobile.ts          # Mobile detection hook
│
├── .env                           # Environment variables
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.ts                 # Next.js configuration
├── eslint.config.mjs              # ESLint configuration
├── components.json                # shadcn/ui configuration
└── Caddyfile                      # Caddy gateway config (for sandbox deployment)
```

---

## Database Schema

The application uses 5 Prisma models:

### User
Stores authenticated users with two roles.
```prisma
model User {
  id           String   @id @default(cuid())
  username     String   @unique
  password     String              // bcrypt hashed
  role         String   @default("GUEST")  // "ADMIN" | "GUEST"
  fullName     String?
  phone        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  loginHistory LoginHistory[]
}
```

### LoginHistory
Tracks all login attempts (success and failure) for audit.
```prisma
model LoginHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ip        String?
  userAgent String?
  success   Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

### Kegiatan (Activity)
Church activities with optional image and auto-expiration.
```prisma
model Kegiatan {
  id            String   @id @default(cuid())
  name          String
  description   String?
  scheduleDay   String?              // e.g., "Minggu", "Senin & Sabtu"
  scheduleTime  String?              // e.g., "09:00", "05:00-06:00"
  location      String?
  category      String   @default("UMUM")  // IBADAH_RAYA | RUMAH_DOA | DOA_PAGI | UMUM
  imageUrl      String?              // Path to uploaded image (/uploads/...)
  eventDate     DateTime?            // Specific event date (for countdown)
  expiredAt     DateTime?            // Auto-delete after this time
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### CoolCommunity (COOL)
Community of Love small groups.
```prisma
model CoolCommunity {
  id        String   @id @default(cuid())
  name      String
  leader    String?
  phone     String              // Format: 628xxx (international, no +)
  area      String?
  meetDay   String?
  meetTime  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Setting
Key-value store for application configuration.
```prisma
model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}
```

### Default Settings (seeded)

| Key | Default Value | Description |
|-----|---------------|-------------|
| `gform_link` | `https://forms.gle/placeholder-gbi-pejaten` | Google Form for service registration |
| `instagram` | `https://instagram.com/gbipejatenvillage` | Church Instagram |
| `youtube` | `https://youtube.com/@gbipejatenvillage` | Church YouTube |
| `facebook` | `https://facebook.com/gbipejatenvillage` | Church Facebook |
| `qris_image_url` | `""` (empty) | QRIS image path (upload via Persembahan page) |
| `church_tagline` | `Menjadi Rumah Doa Bagi Bangsa-Bangsa` | Church tagline |
| `church_address` | `Pejaten Village, Jakarta Selatan` | Church address |
| `church_phone` | `081234567890` | Church contact phone |

---

## API Reference

All API routes are under `/api/`. Authentication uses HTTP-only cookies.

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | Login with username/password, returns JWT in cookie | Public |
| `POST` | `/api/auth/logout` | Logout, clears auth cookie | Public |
| `GET` | `/api/auth/me` | Get current authenticated user | Public (returns null if not logged in) |
| `GET` | `/api/auth/profile` | Get full profile | User |
| `PUT` | `/api/auth/profile` | Update profile (name, phone, password) | User |

**Login Request:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "message": "Login berhasil",
  "user": {
    "id": "clx...",
    "username": "admin",
    "role": "ADMIN",
    "fullName": "Administrator GBI Pejaten",
    "phone": "081234567890"
  }
}
```

### Kegiatan (Activities)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/kegiatan` | List all activities (auto-cleans expired) | Public |
| `POST` | `/api/kegiatan` | Create activity (multipart/form-data with image) | Admin |
| `PUT` | `/api/kegiatan/[id]` | Update activity | Admin |
| `DELETE` | `/api/kegiatan/[id]` | Delete activity (also removes image file) | Admin |

**Create Activity (multipart/form-data):**
```
POST /api/kegiatan
Content-Type: multipart/form-data

Fields:
- name: string (required)
- description: string
- scheduleDay: string
- scheduleTime: string
- location: string
- category: string (IBADAH_RAYA | RUMAH_DOA | DOA_PAGI | UMUM)
- eventDate: string (ISO datetime, e.g., "2024-12-25T19:00")
- expiredAt: string (ISO datetime)
- image: File (JPG/PNG/WEBP, max 5MB)
```

### CoolCommunity (COOL)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/cool` | List all COOL communities | Public |
| `POST` | `/api/cool` | Create COOL | Admin |
| `PUT` | `/api/cool/[id]` | Update COOL | Admin |
| `DELETE` | `/api/cool/[id]` | Delete COOL | Admin |

**Create COOL:**
```json
POST /api/cool
Content-Type: application/json

{
  "name": "COOL Pejaten",
  "leader": "Pdt. Yohanes",
  "phone": "6281234567001",
  "area": "Pejaten, Jakarta Selatan",
  "meetDay": "Jumat",
  "meetTime": "19:30"
}
```

### Login History

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/login-history` | Get 50 latest login attempts | Admin |

### Settings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/settings` | Get all settings (with defaults) | Public |
| `PUT` | `/api/settings` | Update settings (key-value pairs) | Admin |

### Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/upload` | Upload image (QRIS or activity image) | Admin |

**Upload Request:**
```
POST /api/upload
Content-Type: multipart/form-data

Fields:
- file: File (JPG/PNG/WEBP, max 5MB)
- purpose: string ("qris" | "kegiatan") - default: "qris"
```

**Response:**
```json
{
  "url": "/uploads/qris-1234567890-abc.webp"
}
```

### Seed

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/seed` | Initialize database with default data | Public |

---

## Authentication & Authorization

### How It Works

1. **Login:** User submits username + password → server verifies with bcrypt → JWT token signed with `JWT_SECRET` → stored in HTTP-only cookie (`gbi_auth_token`) → valid for 7 days
2. **Session Check:** `GET /api/auth/me` reads cookie, verifies JWT, returns user object or null
3. **Protected Routes:** 
   - **User routes** (profile): Requires valid session
   - **Admin routes** (dashboard, kegiatan-manage, settings, login-history, upload): Requires `role === "ADMIN"`
4. **Logout:** Clears the auth cookie

### Security Features

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT stored in HTTP-only cookie (not accessible via JavaScript)
- ✅ `sameSite: "lax"` prevents CSRF
- ✅ `secure: true` in production (HTTPS only)
- ✅ Login attempts logged (success and failure) with IP and User-Agent
- ✅ Password change requires current password verification

### Role-Based Access

| Page | Public | Guest | Admin |
|------|--------|-------|-------|
| Landing | ✅ | ✅ | ✅ |
| Kegiatan List | ✅ | ✅ | ✅ |
| COOL Directory | ✅ | ✅ | ✅ |
| Pendaftaran Pelayanan | ✅ | ✅ | ✅ |
| Persembahan | ✅ | ✅ | ✅ |
| Login | ✅ | (redirects if logged in) | (redirects if logged in) |
| Profile | ❌ | ✅ | ✅ |
| Dashboard | ❌ | ❌ | ✅ |
| Kelola Kegiatan | ❌ | ❌ | ✅ |
| Settings | ❌ | ❌ | ✅ |

---

## Pages & User Flows

### 1. Landing Page (`home`)
- **Hero section** with church name, tagline, and CTA buttons
- **Ibadah Minggu card** showing 3 Sunday service sessions
- **Quick services grid** (4 cards: Kegiatan, COOL, Pelayanan, Persembahan)
- **Activity carousel** (only shows activities with images)
- **Upcoming activities** grid (6 latest)

### 2. Login Page (`login`)
- Standalone page (no navbar/footer)
- Username + password form
- Show/hide password toggle
- Demo credentials displayed
- Redirects to dashboard (admin) or home (guest) on success

### 3. Admin Dashboard (`dashboard`)
- **Stats cards**: Total Activities, Total COOL, Successful Logins, Failed Logins
- **Quick action cards**: Kelola Kegiatan, Kelola COOL, Pengaturan
- **Login History table**: 50 latest entries with user, role, IP, user-agent, timestamp, success/failure status

### 4. Kelola Kegiatan (`kegiatan-manage`) — Admin
- Grid of activity cards with image, name, schedule, expiration
- **Add Activity** button opens dialog form
- **Edit** and **Delete** buttons per card
- Form includes: image upload (with preview), name, description, category, location, day, time, event date, expiration date

### 5. Daftar Kegiatan (`kegiatan-list`) — Public
- Search bar + category filter dropdown
- Grid of activity cards
- Click card to open detail dialog with full info

### 6. COOL Directory (`cool`) — Public
- Grid of COOL community cards
- Each card shows: name, leader, area, meeting day/time, phone
- **"Hubungi via WhatsApp"** button → redirects to `https://wa.me/{phone}`
- Admin sees additional Edit/Delete buttons

### 7. Pendaftaran Pelayanan (`pelayanan`) — Public
- Hero banner with **"Daftar Sekarang"** button → redirects to Google Form
- Grid of 6 service departments (Pujian, Firman, Usher, MC, Multimedia, Doa)
- FAQ section

### 8. Persembahan (`persembahan`) — Public
- QRIS code display (placeholder if not uploaded)
- Admin sees **"Upload QRIS"** button
- List of offering types (Umum, Persepuluhan, Syukur, Misi)
- Contact info for treasurer

### 9. Profile (`profile`) — Authenticated
- Display username, full name, role badge
- Edit form: full name, phone number
- Password change section (requires current password)
- Show/hide password toggles

### 10. Settings (`settings`) — Admin
- **Link Eksternal**: Google Form URL, Instagram, YouTube, Facebook
- **Info Gereja**: Tagline, address, phone
- Link to upload QRIS (redirects to Persembahan page)

---

## Configuration

### Environment Variables (`.env`)

```env
# Database (SQLite file path)
DATABASE_URL=file:./db/custom.db

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=gbi-pejaten-upperroom-secret-key-2024
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Create database migration |
| `npm run db:reset` | Reset database (destructive!) |

### Image Upload Specifications

- **Allowed formats:** JPG, PNG, WEBP
- **Max file size:** 5MB
- **Processing:** 
  - Activity images: resized to 1200×800 (cover), converted to WebP (quality 80)
  - QRIS images: resized to 800×800 (inside, no enlargement), converted to WebP (quality 85)
- **Storage:** `/public/uploads/` directory
- **URL pattern:** `/uploads/{filename}.webp`

### Auto-Expire Mechanism

Activities with `expiredAt` in the past are automatically deleted:
- Triggered on every `GET /api/kegiatan` request
- Uses Prisma query: `DELETE FROM Kegiatan WHERE expiredAt < now()`
- Also deletes associated image files from disk

---

## Deployment

### Production Checklist

1. **Update `.env`:**
   ```env
   DATABASE_URL=file:./db/custom.db
   JWT_SECRET=your-strong-random-secret-here-at-least-32-chars
   NODE_ENV=production
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start production server:**
   ```bash
   npm run start
   ```

4. **Run seed (first time only):**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

5. **Change default passwords:**
   - Login as admin
   - Go to Profile → Change Password
   - Update `admin123` to a strong password

6. **Upload QRIS image:**
   - Login as admin
   - Go to Persembahan → Upload QRIS

7. **Update Settings:**
   - Go to Settings (admin)
   - Update Google Form link
   - Update social media links
   - Update church info

### Database Backup

Since SQLite is used, backup is simple:
```bash
cp db/custom.db db/custom-backup-$(date +%Y%m%d).db
```

### Switching to MongoDB

To use MongoDB instead of SQLite:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mongodb"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/gbi-pejaten"
   ```

3. Adjust schema fields (MongoDB doesn't support some SQLite features; use `@db.ObjectId` where needed)

4. Run:
   ```bash
   npx prisma db push
   ```

---

## Default Credentials

After running the seed, these accounts are created:

| Role | Username | Password | Full Name |
|------|----------|----------|-----------|
| Admin | `admin` | `admin123` | Administrator GBI Pejaten |
| Guest | `guest` | `guest123` | Tamu Gereja |

⚠️ **IMPORTANT:** Change these passwords immediately in production via the Profile page.

---

## Troubleshooting

### Common Issues

**1. "Database connection failed"**
- Ensure `DATABASE_URL` is correct in `.env`
- Run `npx prisma db push` to create the database
- Run `npx prisma generate` to regenerate the client

**2. "Login fails with 401"**
- Verify the seed has been run (`POST /api/seed`)
- Check that username/password match defaults: `admin` / `admin123`
- Clear browser cookies and try again

**3. "Image upload fails"**
- Ensure `public/uploads/` directory is writable
- Check file format (JPG/PNG/WEBP only)
- Verify file size is under 5MB
- Check that `sharp` is installed (`npm install sharp`)

**4. "QRIS not showing"**
- Admin must upload QRIS image via Persembahan page
- Check `/api/settings` returns `qris_image_url` with a value

**5. "Dark mode not persisting"**
- Ensure cookies/localStorage are not blocked
- The theme is stored in localStorage by next-themes

**6. "Activities not appearing"**
- Activities may have expired (check `expiredAt`)
- The auto-cleanup runs on every `GET /api/kegiatan`
- Create new activities via admin dashboard

**7. "WhatsApp link not working"**
- Ensure phone number is in international format (e.g., `6281234567890`)
- No `+`, spaces, or dashes in the number
- Link format: `https://wa.me/6281234567890`

### Development Tips

- Check `dev.log` for server logs and errors
- Use browser DevTools Network tab to debug API calls
- Prisma queries are logged in development mode
- The Zustand store can be inspected via React DevTools

### Performance Notes

- Images are optimized to WebP format (smaller file size)
- Carousel only renders activities with images
- Login history limited to 50 entries per query
- Auto-expire cleanup runs lazily (only when activities are fetched)

---

## License

This project is built for **GBI Pejaten Village Upperroom** church. All rights reserved.

---

## Credits

- **Church:** GBI Pejaten Village Upperroom
- **Framework:** Next.js 16
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Database:** Prisma ORM + SQLite

---

*Built with faith and modern web technologies. Soli Deo Gloria.*
#   W e b - G e r e j a  
 