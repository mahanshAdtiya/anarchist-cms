# Anarchist.in — Store Admin Dashboard

A full-featured admin dashboard for managing an e-commerce store. Built with Next.js 16 and connects to a separate backend API.

## Features

- **Dashboard** — Revenue overview, sales count, stock levels, and monthly revenue chart
- **Billboards** — Create and manage promotional banners with Cloudinary image uploads
- **Categories** — Organize products into categories linked to billboards
- **Products** — Full inventory management with images, pricing, sizes, colors, and featured/archived status
- **Orders** — View orders with payment status and shipping details
- **Sizes & Colors** — Manage product variant options
- **Settings** — Store and user profile configuration

## Tech Stack

- **Framework:** Next.js 16.2.4 (App Router, Turbopack) + TypeScript
- **UI:** Tailwind CSS + Shadcn/UI + Radix UI
- **Forms:** React Hook Form + Zod
- **State:** Zustand (auth store, persisted to localStorage)
- **Charts:** Recharts
- **Tables:** TanStack React Table
- **Images:** Next Cloudinary
- **Auth:** JWT via cookies, validated against backend

## Prerequisites

- Node.js 18+
- pnpm
- Backend API running at `http://localhost:8080` (see [Backend API](#backend-api))
- A Cloudinary account

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   NODE_ENV=development
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

3. **Start the backend API** (must be running before the frontend)

4. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/log-in`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Backend API

This frontend requires a backend API server running at `http://localhost:8080`. The following endpoints must be available:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate with email & password |
| `GET` | `/users/whoAmI` | Validate token & get current user |
| `GET/POST/PATCH/DELETE` | `/billboards` | Billboard CRUD |
| `GET/POST/PATCH/DELETE` | `/categories` | Category CRUD |
| `GET/POST/PATCH/DELETE` | `/sizes` | Size CRUD |
| `GET/POST/PATCH/DELETE` | `/colors` | Color CRUD |
| `GET/POST/PATCH/DELETE` | `/products` | Product CRUD |
| `GET` | `/orders` | List orders |

All protected endpoints require a `Bearer <token>` Authorization header.

## Project Structure

```
├── app/
│   ├── (auth)/              # Login page
│   └── dashboard/
│       └── (routes)/        # Dashboard feature pages
│           ├── billboards/
│           ├── categories/
│           ├── colors/
│           ├── orders/
│           ├── products/
│           ├── settings/
│           └── sizes/
├── actions/                 # Server-side data fetching
├── components/
│   └── ui/                  # Shadcn/UI primitives
├── lib/
│   └── store.ts             # Zustand auth store
├── utils/
│   └── type.ts              # TypeScript interfaces
└── proxy.ts                 # Auth token validation & route protection
```
