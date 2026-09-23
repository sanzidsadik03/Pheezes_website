# Pheezes — Full-Stack E-Commerce Website & Admin Dashboard

> "Gifts that elevate every moment."

A production-ready full-stack website and admin management system for **Pheezes**, a premium gift shop in Bangladesh.

---

## 🌟 Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Design System tokens, `@theme`)
- **Database & ORM**: PostgreSQL (Neon Serverless) + Prisma ORM
- **Authentication**: NextAuth.js v5 (Credentials Provider + JWT sessions + bcrypt)
- **Media Storage**: Cloudinary (Server-signed direct client uploads)
- **Validation**: Zod + React Hook Form
- **UI Components**: Radix UI + Lucide React + Sonner Toaster
- **Carousels & Drag-and-Drop**: Embla Carousel + @dnd-kit

---

## 🚀 Key Features

### 🛒 Customer-Facing Website
- **Branded Design System**: Pheezes signature black (`#0A0A0A`), warm gold yellow (`#FFD93D`), and clean white layout.
- **Hero Spotlight**: Dynamic tagline, animated badge, call-to-actions, and quick delivery cost preview.
- **Product Catalog**:
  - Full product list with instant search and multi-criteria filters (category, stock status, special offers).
  - Clean pagination and responsive grid.
- **Product Detail**:
  - Interactive multi-image gallery with thumbnail switcher and full-screen lightbox.
  - Video support for product demonstrations.
  - Dynamic pricing (strikethrough regular price + calculated discount percentage badge).
  - Stock availability indicators (`In Stock`, `Out of Stock`, `Coming Soon`).
  - Integrated Messenger order button with product pre-fill.
- **Special Offers Page**: Filtered showcase of all discounted gift items.
- **Customer Reviews**: Embla touch-carousel + complete testimonials gallery.
- **Delivery Information**: Transparent delivery rates (Inside Dhaka 80 TK COD, Outside Dhaka 120 TK Advance) configurable via Admin.
- **About Page**: Brand story and core values.
- **Direct Messenger Checkout**: All "Order Now" buttons open Facebook Messenger with pre-populated contextual order messages.

### 🛡️ Admin Dashboard (`/admin`)
- **Secure Authentication**: NextAuth.js v5 with bcrypt password hashing.
- **Executive Analytics**: Real-time stats for products, active inventory, special offers, out-of-stock items, and customer reviews.
- **Product Management**:
  - Full CRUD (Create, Read, Update, Delete) with auto slug generation.
  - Multi-image & video uploads via Cloudinary signed uploads.
  - Set primary image & reorder images.
  - Stock status & visibility toggles.
  - Special offer pricing & toggles.
  - Custom SEO meta titles & descriptions.
- **Review Management**:
  - Add & edit customer reviews with star ratings (1–5).
  - Attach customer review photos.
  - Toggle review visibility and display order.
- **Live Website Settings**:
  - **Delivery**: Change Inside/Outside Dhaka rates and payment terms.
  - **Social Media**: Manage Facebook, Instagram, and TikTok links.
  - **Messenger**: Configure Messenger URL and default message template.
  - **Homepage**: Edit hero headline, sub-headline, and about text.
  - **General**: Site name and tagline.

---

## 🛠️ Environment Variables Setup

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_DIRECT_URL="postgresql://user:password@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth v5
AUTH_SECRET="your-32-character-random-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Initial Admin Credentials
ADMIN_EMAIL="admin@pheezes.com"
ADMIN_PASSWORD="Pheezes1234"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Migrate Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Initial Data
```bash
npm run seed
# Or: npx ts-node prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Visit:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
  - **Email**: `admin@pheezes.com`
  - **Password**: `Pheezes1234`

---

## 📁 Project Structure

```
d:/pheezes_website/
├── actions/                  # Server Actions (Products, Reviews, Settings)
├── app/
│   ├── (customer)/           # Public customer routes (Home, Products, Offers, Reviews, Delivery, About)
│   ├── admin/                # Protected admin dashboard & settings
│   ├── api/
│   │   ├── auth/             # NextAuth route handlers
│   │   └── upload/           # Cloudinary signed upload endpoint
│   ├── globals.css           # Tailwind v4 theme & brand styles
│   ├── layout.tsx            # Root layout with Inter font & Sonner toaster
│   ├── robots.ts             # SEO robots.txt
│   └── sitemap.ts            # Dynamic XML sitemap generator
├── components/
│   ├── admin/                # Admin UI (Sidebar, Header, Forms, Uploader, Tables)
│   ├── customer/             # Customer UI (Navbar, Footer, Hero, Cards, Carousels)
│   └── ui/                   # Core reusable UI atoms (Button, Card, Dialog, etc.)
├── lib/
│   ├── auth.ts               # NextAuth v5 configuration
│   ├── cloudinary.ts         # Cloudinary SDK wrapper
│   ├── prisma.ts             # Prisma client singleton
│   ├── utils.ts              # Utility functions & helpers
│   └── validations.ts        # Zod validation schemas
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeder
├── public/
│   └── logo.jpg              # Official Pheezes logo
└── types/                    # Shared TypeScript definitions
```
