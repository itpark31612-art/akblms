# 🎓 Education Management System (EMS)

**Enterprise darajasidagi professional ta’lim boshqaruv platformasi (Monorepo Arxitekturasi)**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Node.js-Express_4-green?logo=node.js)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-purple.svg)](LICENSE)

---

## 📌 Mundarija

1. [Loyiha haqida](#-loyiha-haqida)
2. [Texnologiyalar Steki](#-texnologiyalar-steki)
3. [Arxitektura va Rollar Tizimi](#-arxitektura-va-rollar-tizimi)
4. [Monorepo Strukturasi](#-monorepo-strukturasi)
5. [O‘rnatish va Ishga Tushirish](#-ornatish-va-ishga-tushirish)
6. [Tayyor Demo Hisoblar (Seeding)](#-tayyor-demo-hisoblar-seeding)
7. [API Arxitekturasi va Endpointlar](#-api-arxitekturasi-va-endpointlar)
8. [Error Handling va Logging Tizimi](#-error-handling-va-logging-tizimi)
9. [Testlash (Testing)](#-testlash-testing)
10. [Keyingi Modullarni Qo‘shish Qo‘llanmasi](#-keyingi-modullarni-qoshish-qollanmasi)

---

## 🚀 Loyiha haqida

**Education Management System (EMS)** — bu zamonaviy ta’lim muassasalari (maktablar, litseylar, universitetlar va o‘quv markazlari) uchun ishlab chiqilgan kengaytiriluvchan (scalable) va xavfsiz boshqaruv platformasi.

Tizim barcha ta’lim ishtirokchilarini (Super Admin, Admin, Pedagoglar, O‘quvchilar va Ota-onalar) yagona axborot muhitiga birlashtiradi.

---

## 🛠 Texnologiyalar Steki

| Qatlam         | Texnologiya                    | Tavsif                                                              |
| :------------- | :----------------------------- | :------------------------------------------------------------------ |
| **Monorepo**   | NPM Workspaces                 | Yagona repozitoriyda `@ems/shared`, `@ems/backend`, `@ems/frontend` |
| **Frontend**   | React 19 + TypeScript + Vite   | Yuqori unumdorlikka ega SPA                                         |
| **Styling**    | Tailwind CSS v4                | Zamonaviy va moslashuvchan dizayn tizimi                            |
| **Animation**  | Framer Motion                  | Sahifa o‘tishlari va modal oynalar animatsiyasi                     |
| **Icons**      | Lucide React                   | Toza va zamonaviy SVG piktogrammalar                                |
| **Charts**     | Recharts                       | Interaktiv statistik grafiklar (Area, Bar, Pie)                     |
| **Backend**    | Node.js + Express + TypeScript | Type-safe Controller-Service arxitekturasi                          |
| **Database**   | PostgreSQL 16                  | Relyatsion ma’lumotlar bazasi                                       |
| **ORM**        | Prisma ORM                     | Type-safe schema, migrations va auto-generated client               |
| **Auth**       | JWT + Refresh Token Rotation   | Cookie va Bearer sarlavhasi orqali xavfsiz autentifikatsiya         |
| **Logging**    | Winston + Morgan               | Fayl va rangli konsol orqali strukturalangan loglar                 |
| **Validation** | Zod                            | Runtime so‘rov validatsiyasi va DTO infering                        |
| **Testing**    | Vitest + Playwright            | Unit, integratsion va E2E testlar                                   |

---

## 👥 Arxitektura va Rollar Tizimi

EMS platformasida **5 ta asosiy rol** mavjud bo‘lib, har biri uchun alohida moslashtirilgan Dashboard va ruxsatlar matriksiga ega:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   EDUCATION MANAGEMENT SYSTEM (EMS)                    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│ SUPER ADMIN  │            │    ADMIN     │            │   TEACHER    │
├──────────────┤            ├──────────────┤            ├──────────────┤
│ Global tarmoq│            │ Maktab nazor-│            │ Dars jadvali,│
│ Filiallar    │            │ ati, sinflar,│            │ Baholash,    │
│ Tizim loglari│            │ O'qituvchilar│            │ Davomat      │
└──────────────┘            └──────────────┘            └──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
             ┌──────────────┐              ┌──────────────┐
             │   STUDENT    │              │    PARENT    │
             ├──────────────┤              ├──────────────┤
             │ GPA, Kurslar,│              │ Farzandlar   │
             │ Topshiriqlar,│              │ monitoringi, │
             │ Davomatim    │              │ To'lovlar    │
             └──────────────┘              └──────────────┘
```

1. **Super Admin (Tizim Bosh Administratori)**:
   - Butun ta’lim tarmog‘ining global infratuzilmasi, barcha filiallar/maktablar nazorati.
   - Tizim yuklamasi va audit loglari monitoringi.
2. **Admin (Maktab Administratori)**:
   - Muayyan maktab bo‘yicha pedagoglar, o‘quvchilar va sinflarni boshqarish.
   - Qabul arizalari va maktab davomat tahlili.
3. **Teacher (O‘qituvchi)**:
   - Biriktirilgan fanlar, dars jadvali, o‘quvchilarga baho qo‘yish va davomat yuritish.
4. **Student (O‘quvchi)**:
   - Shaxsiy o‘zlashtirish (GPA), topshiriqlar ro‘yxati, dars jadvali va davomat ko‘rsatkichi.
5. **Parent (Ota-ona)**:
   - Farzandlarining darsdagi ishtiroki, baholari grafigi, to‘lovlar monitoringi va o‘qituvchilar bilan to‘g‘ridan-to‘g‘ri aloqa.

---

## 📂 Monorepo Strukturasi

```
akblms/
├── apps/
│   ├── backend/                      # Node.js + Express + Prisma API
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # To'liq relyatsion model
│   │   │   └── seed.ts               # Boshlang'ich ma'lumotlar generatori
│   │   ├── src/
│   │   │   ├── config/               # Env va tizim sozlamalari
│   │   │   ├── db/                   # Prisma singleton client
│   │   │   ├── errors/               # Custom AppError sinflari
│   │   │   ├── middlewares/          # Auth, Role, Validator, RateLimit, Error
│   │   │   ├── modules/
│   │   │   │   ├── auth/             # Login, Register, Refresh, Logout
│   │   │   │   ├── users/            # CRUD foydalanuvchilar
│   │   │   │   ├── courses/          # CRUD kurslar va fanlar
│   │   │   │   ├── analytics/        # Rollar bo'yicha analitika
│   │   │   │   └── system/           # Health check endpoint
│   │   │   ├── utils/                # Logger (Winston), JWT, Password, API Response
│   │   │   ├── app.ts                # Express ilovasi
│   │   │   └── server.ts             # HTTP server va Graceful Shutdown
│   │   ├── tests/                    # Vitest integratsion testlari
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   │
│   └── frontend/                     # React 19 + Vite + Tailwind Client
│       ├── e2e/                      # Playwright E2E testlari
│       ├── src/
│       │   ├── api/                  # Axios client, interceptorlar va API xizmatlari
│       │   ├── components/
│       │   │   ├── common/           # Button, Input, Card, Modal, Badge, StatsCard
│       │   │   └── layout/           # AppLayout, Sidebar, Header, ProtectedRoute
│       │   ├── context/              # AuthContext (JWT, Quick Demo Login, Switcher)
│       │   ├── pages/
│       │   │   ├── auth/             # LoginPage (Demo rollar bilan tezkor kirish)
│       │   │   ├── dashboard/        # Rollarga moslashtirilgan 5 ta Dashboard View
│       │   │   ├── users/            # UsersPage (Filtr, qidiruv, yangi qo'shish)
│       │   │   ├── courses/          # CoursesPage (Fanlar katalogi, yaratish)
│       │   │   ├── analytics/        # AnalyticsPage (Recharts grafiklari)
│       │   │   ├── schedule/         # SchedulePage (Dars jadvali)
│       │   │   ├── grades/           # GradesPage (Baholar daftari)
│       │   │   ├── payments/         # PaymentsPage (To'lovlar monitoringi)
│       │   │   ├── settings/         # SettingsPage (Profil sozlamalari)
│       │   │   ├── ForbiddenPage.tsx # 403 sahifasi
│       │   │   └── NotFoundPage.tsx  # 404 sahifasi
│       │   ├── App.tsx               # SPA Marshrutlash (Routing)
│       │   ├── main.tsx              # React Root
│       │   └── index.css             # Tailwind CSS va asosiy stillar
│       ├── playwright.config.ts
│       └── vitest.config.ts
│
├── packages/
│   └── shared/                       # Umumiy paket (SSOT - Single Source of Truth)
│       └── src/
│           ├── constants/            # UserRole enum, rollar ruxsatlari va nomlari
│           ├── types/                # ApiResponse, DTOlar, User, Auth, Models
│           └── validators/           # Zod validatsiya sxemalari
│
├── .env.example                      # Barcha muhit o'zgaruvchilari shabloni
├── docker-compose.yml                # PostgreSQL 16 va pgAdmin konteynerlari
├── package.json                      # Monorepo ildiz boshqaruvi
├── tsconfig.base.json                # Umumiy TypeScript strict konfiguratsiyasi
└── README.md
```

---

## ⚡ O‘rnatish va Ishga Tushirish

### 1. Talablar

- **Node.js**: `v20+` yoki `v22+` (tavsiya etiladi: `v24`)
- **NPM**: `v10+` yoki `v11+`
- **Docker & Docker Compose** (PostgreSQL uchun)

### 2. Loyihani klonlash va bog‘liqliklarni o‘rnatish

```bash
git clone <repo-url>
cd akblms

# Monorepo barcha bog'liqliklarini bitta buyruq bilan o'rnatish:
npm install
```

### 3. Muhit o‘zgaruvchilarini sozlash

```bash
# Ildiz katalogida .env faylini yaratish:
cp .env.example .env
```

### 4. PostgreSQL bazasini Docker orqali ko‘tarish

```bash
docker compose up -d postgres
```

### 5. Prisma migratsiya va Seeding (Boshlang‘ich ma’lumotlarni yozish)

```bash
# Prisma klientini generatsiya qilish:
npm run db:generate

# Jadvallarni bazaga yozish:
npm run db:migrate
# yoki to'g'ridan-to'g'ri push qilish:
npm run --workspace=@ems/backend db:push

# Boshlang'ich 5 ta roldagi foydalanuvchilar va kurslarni yaratish:
npm run db:seed
```

### 6. Loyihani Parallel Ishga Tushirish (Dev Mode)

```bash
# Backend va Frontend bir vaqtda ishga tushadi:
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/v1/health`

---

## 🔑 Tayyor Demo Hisoblar (Seeding)

Tizimni darhol sinab ko‘rish uchun barcha 5 ta rol bo‘yicha tayyor hisoblar mavjud. Login sahifasida **"Bir bosishda kirish (Demo Rollar)"** tugmalari ham integratsiya qilingan:

| Rol                | Login (Email)          | Parol         | Ruxsat doirasi                               |
| :----------------- | :--------------------- | :------------ | :------------------------------------------- |
| 👑 **Super Admin** | `superadmin@ems.local` | `Admin123!`   | Tizimning to‘liq nazorati, filiallar, loglar |
| 🏢 **Admin**       | `admin@ems.local`      | `Admin123!`   | Maktab ma’muriyati, o‘qituvchilar, qabul     |
| 👨‍🏫 **O‘qituvchi**  | `teacher@ems.local`    | `Teacher123!` | Dars jadvali, baholash, davomat              |
| 👨‍🎓 **O‘quvchi**    | `student@ems.local`    | `Student123!` | GPA, kurslarim, topshiriqlar, dars jadvali   |
| 👨‍👩‍👦 **Ota-ona**     | `parent@ems.local`     | `Parent123!`  | Farzandlar monitoringi, to‘lovlar, aloqa     |

> **Eslatma:** Tizimga kirgandan so‘ng, ekranning yuqori o‘ng burchagidagi **"Rol: ..."** menyusi orqali bir bosishda boshqa roldagi Dashboard ko‘rinishiga o‘tishingiz mumkin!

---

## 🌐 API Arxitekturasi va Endpointlar

Barcha API javoblari standartlashtirilgan formatda qaytariladi:

```typescript
// Muvaffaqiyatli javob formati:
{
  "success": true,
  "message": "Amal muvaffaqiyatli bajarildi",
  "data": { ... },
  "meta": { "timestamp": "2026-11-17T06:30:00.000Z" }
}

// Xatolik javob formati:
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Ma’lumotlar formati noto‘g‘ri",
    "details": [ ... ],
    "timestamp": "2026-11-17T06:30:00.000Z",
    "path": "/api/v1/auth/login"
  }
}
```

### Asosiy Endpointlar Ro‘yxati:

| Metod    | Endpoint                      | Tavsif                                        | Ruxsat             |
| :------- | :---------------------------- | :-------------------------------------------- | :----------------- |
| `GET`    | `/api/v1/health`              | Tizim, xotira va DB holati                    | Ochiq              |
| `POST`   | `/api/v1/auth/login`          | Tizimga kirish (JWT Access + Refresh)         | Ochiq              |
| `POST`   | `/api/v1/auth/register`       | Ro‘yxatdan o‘tish                             | Ochiq              |
| `POST`   | `/api/v1/auth/refresh`        | Tokenni yangilash (Token Rotation)            | Ochiq              |
| `POST`   | `/api/v1/auth/logout`         | Chiqish (Refresh tokenni bekor qilish)        | Auth               |
| `GET`    | `/api/v1/auth/me`             | Joriy foydalanuvchi ma’lumotlari              | Auth               |
| `GET`    | `/api/v1/users`               | Foydalanuvchilar ro‘yxati (Filtr, sahifalash) | Super Admin, Admin |
| `POST`   | `/api/v1/users`               | Yangi foydalanuvchi yaratish                  | Super Admin, Admin |
| `DELETE` | `/api/v1/users/:id`           | Foydalanuvchini o‘chirish                     | Super Admin, Admin |
| `GET`    | `/api/v1/courses`             | Kurslar katalogi                              | Barcha rollar      |
| `POST`   | `/api/v1/courses`             | Yangi kurs yaratish                           | Admin, Teacher     |
| `GET`    | `/api/v1/analytics/dashboard` | Rolga moslashtirilgan analitika               | Barcha rollar      |

---

## 🛡 Error Handling va Logging Tizimi

1. **Strukturaviy Logging (Winston + Morgan)**:
   - Konsolda rangli, vaqt belgilari ko‘rsatilgan HTTP so‘rovlar.
   - `logs/error.log`: Faqat xatolar va stek treyslari (max: 5MB, avtomatik aylanish).
   - `logs/combined.log`: Barcha amallar va audit yozuvlari.

2. **Custom Error Classes (`AppError`)**:
   - `BadRequestError (400)`, `UnauthorizedError (401)`, `ForbiddenError (403)`, `NotFoundError (404)`, `ConflictError (409)`, `ValidationError (422)`, `InternalServerError (500)`.

3. **Global Error Middleware**:
   - Zod sxema xatolarini avtomatik ushlab, qaysi maydonda xatolik borligini aniq ko‘rsatadi.
   - Production rejimida ichki server xatolarini xavfsiz berkitadi, dasturchiga esa to‘liq log saqlanadi.

---

## 🧪 Testlash (Testing)

Loyiha Vitest va Playwright orqali sinovdan o‘tkaziladi:

```bash
# Barcha paketlardagi testlarni ishga tushirish:
npm run test

# Backend API testlari (Vitest + Supertest):
npm run test:backend

# Frontend UI testlari (Vitest + Testing Library):
npm run test:frontend

# Playwright E2E brauzer testlari:
npm run test:e2e
```

---

## 🏗 Keyingi Modullarni Qo‘shish Qo‘llanmasi

Ushbu arxitektura keyingi funksional modullarni minimal o‘zgarish bilan qo‘shishga tayyor:

1. **Yangi model yaratish**:
   - `apps/backend/prisma/schema.prisma` ga model qo‘shing va `npx prisma migrate dev` qiling.
2. **Shared turlarni yangilash**:
   - `packages/shared/src/types/` ga yangi interfeys va Zod sxemani kiriting.
3. **Backend modulini yaratish**:
   - `apps/backend/src/modules/<modul_nomi>/` papkasida `.service.ts`, `.controller.ts`, `.routes.ts` yarating va `src/app.ts` ga ulang.
4. **Frontend sahifasini ulash**:
   - `apps/frontend/src/pages/<modul_nomi>/` da sahifa yarating va `src/App.tsx` marshrutlariga joylang.

---

🎉 **EMS Platformasi muvaffaqiyatli ishga tushirildi va kengaytirishga to‘liq tayyor!**
