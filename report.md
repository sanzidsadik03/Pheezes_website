# Pheezes Website — Full Project Audit Report

> **Project:** `pheezes_website` · **Framework:** Next.js 16.3.1 (App Router) · **Stack:** TypeScript, Prisma, PostgreSQL (Neon), Cloudinary, NextAuth v5

---

## 1. Project Overview

**Pheezes** is a premium gift e-commerce storefront built for Bangladesh. It is a **server-rendered, headless-style website** — there is no shopping cart or payment gateway. Orders are placed via **Facebook Messenger**, making the business model conversational commerce.

The project has two distinct halves:

| Zone | URL Prefix | Who sees it |
|---|---|---|
| **Customer Storefront** | `/` | Public visitors |
| **Admin Dashboard** | `/admin` | Authenticated admin only |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.1 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| ORM | Prisma 6 |
| Auth | NextAuth v5 (Credentials provider, JWT sessions) |
| Media Storage | Cloudinary (signed upload) |
| Styling | Tailwind CSS v4 + `tailwind-merge` + `clsx` |
| UI Primitives | Radix UI (Dialog, Select, Switch, Tabs, etc.) |
| Forms | React Hook Form + Zod validation |
| Drag & Drop | dnd-kit |
| Carousels | Embla Carousel |
| Toasts | Sonner |
| Icons | Lucide React |

---

## 3. Directory Structure Map

```
Pheezes_website/
├── app/                          ← Next.js App Router root
│   ├── layout.tsx                ← Root layout (font, Toaster, metadata)
│   ├── globals.css               ← Global Tailwind styles
│   ├── robots.ts                 ← SEO: robots.txt (blocks /admin, /api)
│   ├── sitemap.ts                ← SEO: dynamic XML sitemap
│   ├── (customer)/               ← Route group — customer-facing pages
│   │   ├── layout.tsx            ← Customer shell (Navbar + Footer)
│   │   ├── page.tsx              ← Homepage /
│   │   ├── products/
│   │   │   ├── page.tsx          ← Product catalog /products
│   │   │   └── [slug]/page.tsx   ← Product detail /products/:slug
│   │   ├── about/page.tsx        ← /about
│   │   ├── delivery/page.tsx     ← /delivery
│   │   ├── offers/page.tsx       ← /offers
│   │   └── reviews/page.tsx      ← /reviews
│   ├── admin/
│   │   ├── login/page.tsx        ← /admin/login (public)
│   │   └── (dashboard)/          ← Protected admin route group
│   │       ├── layout.tsx        ← Admin shell (AdminSidebar + auth guard)
│   │       ├── page.tsx          ← /admin — dashboard
│   │       ├── products/
│   │       │   ├── page.tsx      ← Product list table
│   │       │   ├── new/page.tsx  ← Create product
│   │       │   └── [id]/page.tsx ← Edit product
│   │       ├── reviews/
│   │       │   ├── page.tsx      ← Reviews table
│   │       │   ├── new/page.tsx  ← Create review
│   │       │   └── [id]/page.tsx ← Edit review
│   │       └── settings/
│   │           ├── general/      ← Site name, tagline
│   │           ├── homepage/     ← Hero text, about text
│   │           ├── delivery/     ← Delivery charges & payment
│   │           ├── social/       ← Facebook, Instagram, TikTok URLs
│   │           └── messenger/    ← Messenger URL, default message
│   └── api/
│       └── upload/route.ts       ← POST /api/upload → Cloudinary signature
├── actions/                      ← Next.js Server Actions
│   ├── products.ts               ← CRUD for products, images, videos, categories
│   ├── reviews.ts                ← CRUD for reviews + review images
│   └── settings.ts               ← Read/write all site settings
├── components/
│   ├── admin/                    ← Admin-only React components
│   │   ├── AdminHeader.tsx
│   │   ├── AdminSidebar.tsx      ← Collapsible nav, handles sign-out
│   │   ├── ConfirmDialog.tsx
│   │   ├── DeliverySettingsForm.tsx
│   │   ├── GeneralSettingsForm.tsx
│   │   ├── HomepageSettingsForm.tsx
│   │   ├── ImageReorder.tsx      ← dnd-kit drag-to-reorder
│   │   ├── MediaUploader.tsx     ← Dropzone + Cloudinary upload
│   │   ├── MessengerSettingsForm.tsx
│   │   ├── ProductForm.tsx       ← Tabbed product create/edit form
│   │   ├── ProductsTable.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewsTable.tsx
│   │   ├── SocialSettingsForm.tsx
│   │   └── StatsCard.tsx
│   ├── customer/                 ← Public-facing React components
│   │   ├── Navbar.tsx            ← Fixed header, mobile menu
│   │   ├── Footer.tsx            ← Links, social icons, delivery summary
│   │   ├── Hero.tsx              ← Homepage hero section
│   │   ├── FeaturedProducts.tsx  ← Featured + offers sections
│   │   ├── ProductCard.tsx       ← Grid card with image/price/badge
│   │   ├── ProductGrid.tsx       ← Filterable catalog (client component)
│   │   ├── ProductGallery.tsx    ← Image gallery with thumbnails
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewCarousel.tsx    ← Embla auto-scroll carousel
│   │   ├── AboutSection.tsx
│   │   ├── DeliveryInfo.tsx
│   │   ├── MessengerButton.tsx   ← "Order via Messenger" CTA
│   │   ├── OfferBadge.tsx
│   │   └── SocialLinks.tsx
│   └── ui/                       ← Shared design system primitives
│       ├── button.tsx, input.tsx, label.tsx, textarea.tsx
│       ├── badge.tsx, card.tsx, dialog.tsx
│       ├── select.tsx, switch.tsx, tabs.tsx, separator.tsx
│       ├── skeleton.tsx, sheet.tsx, table.tsx
│       ├── Logo.tsx              ← Brand logo component
│       └── icons.tsx             ← Facebook, Instagram, TikTok SVG icons
├── lib/                          ← Shared server-side utilities
│   ├── auth.ts                   ← NextAuth config (exports auth, signIn, signOut)
│   ├── prisma.ts                 ← Prisma client singleton
│   ├── cloudinary.ts             ← Cloudinary config + generateSignature + deleteAsset
│   ├── utils.ts                  ← cn(), formatPrice(), generateSlug(), etc.
│   └── validations.ts            ← Zod schemas for all forms
├── types/index.ts                ← All TypeScript interfaces + ActionResult type
├── prisma/
│   ├── schema.prisma             ← Database models
│   └── seed.ts                   ← Seed admin, categories, products, reviews, settings
├── middleware.ts                 ← Route protection for /admin/*
└── public/                       ← Static assets (logo.jpg, SVGs)
```

---

## 4. Database Schema (Prisma / PostgreSQL)

```
AdminUser          Category
  id (cuid)          id (cuid)
  email (unique)     name (unique)
  password (bcrypt)  slug (unique)
  name                    │
                          │ 1:N
Product ←──────────── Category
  id (cuid)
  name
  slug (unique)
  shortDescription
  description (Text)
  regularPrice (Decimal 10,2)
  offerPrice   (Decimal 10,2)?
  offerEnabled (bool)
  categoryId?
  availability  ← enum: IN_STOCK | OUT_OF_STOCK | COMING_SOON
  visible (bool)
  featured (bool)
  displayOrder (int)
  metaTitle / metaDescription
     │
     ├─1:N─► ProductImage
     │         id, productId, url, publicId, isPrimary, displayOrder
     │
     └─1:N─► ProductVideo
               id, productId, url, publicId, displayOrder

Review
  id, customerName, description (Text)
  rating (1–5)?
  productName (denormalized ref)?
  visible, displayOrder, reviewDate
     │
     └─1:N─► ReviewImage
               id, reviewId, url, publicId

Settings          ← Key-Value store (string:string)
  key (PK)
  value (Text)
```

**All settings** are stored as plain key-value pairs in the `Settings` table, allowing zero-code config changes from the admin panel.

---

## 5. Authentication Flow

```
Browser                 Middleware              NextAuth (lib/auth.ts)    DB
  │                         │                          │                    │
  ├─ GET /admin/products ──►│                          │                    │
  │                         ├─ no JWT session?         │                    │
  │                         ├─ redirect /admin/login ─►│                    │
  │                         │                          │                    │
  ├─ POST signIn()          │                          │                    │
  │   email + password ─────────────────────────────►  │                    │
  │                         │                    authorize()                │
  │                         │                          ├─ findUnique(email)►│
  │                         │                          ├─ bcrypt.compare()  │
  │                         │                          ◄── admin record ────│
  │                         │                    JWT issued (24h)           │
  │◄─── redirect /admin ────│                          │                    │
```

- **Provider:** Credentials (email + bcrypt password)
- **Session strategy:** JWT, 24-hour expiry
- **Middleware:** `middleware.ts` intercepts all `/admin/*` routes; unauthenticated requests are redirected to `/admin/login?callbackUrl=…`
- **Double guard:** Admin layout (`app/admin/(dashboard)/layout.tsx`) also calls `auth()` and redirects if no session — defense in depth

---

## 6. Media Upload Flow (Cloudinary Signed Upload)

```
Browser (MediaUploader.tsx)          /api/upload (route.ts)         Cloudinary CDN
         │                                    │                           │
  1. User drops files                         │                           │
         │                                    │                           │
  2. POST /api/upload { folder } ────────────►│                           │
         │                          auth() check                          │
         │                          generateSignature(folder)             │
         │◄── { signature, timestamp, apiKey, cloudName } ───────────────│
         │                                    │                           │
  3. POST https://api.cloudinary.com/…/upload │                           │
     { file, signature, timestamp, api_key } ──────────────────────────►│
         │                                    │                           │
         │◄─────────────────────────── { secure_url, public_id } ────────│
         │                                    │                           │
  4. Server Action called:                    │                           │
     addProductImage(productId, url, publicId)│                           │
         └── prisma.productImage.create() ───►DB                         │
```

**Key security point:** The `CLOUDINARY_API_SECRET` never reaches the browser. The browser gets a one-time signed token from `/api/upload`, which itself requires an authenticated session.

---

## 7. Server Actions & Data Flow

All data mutations use Next.js **Server Actions** (`'use server'`), not REST API routes (except the upload signature endpoint).

### `actions/products.ts`

| Function | Visibility | What it does |
|---|---|---|
| `getProducts(options?)` | Public | Paginated, filterable product listing |
| `getProductBySlug(slug)` | Public | Single product for detail page |
| `getProductById(id)` | Admin | Single product for edit form |
| `createProduct(data)` | Admin | Create product after Zod validation |
| `updateProduct(id, data)` | Admin | Update product fields |
| `deleteProduct(id)` | Admin | Delete product + Cloudinary assets |
| `addProductImage(...)` | Admin | Save image record to DB |
| `deleteProductImage(id)` | Admin | Delete from DB + Cloudinary |
| `reorderImages(...)` | Admin | Batch update `displayOrder` |
| `setPrimaryImage(...)` | Admin | Set `isPrimary` on one image |
| `addProductVideo(...)` | Admin | Save video record |
| `deleteProductVideo(id)` | Admin | Delete from DB + Cloudinary |
| `getDashboardStats()` | Admin | Aggregate counts for dashboard |
| `getCategories()` | Public | All categories |
| `createCategory(name, slug)` | Admin | New category |
| `generateUniqueSlug(name)` | Admin | Auto-generate collision-free slug |

### `actions/reviews.ts`

| Function | Visibility | What it does |
|---|---|---|
| `getReviews(options?)` | Public | Paginated reviews list |
| `getReviewById(id)` | Admin | Single review for edit |
| `createReview(data)` | Admin | Create review |
| `updateReview(id, data)` | Admin | Update review |
| `deleteReview(id)` | Admin | Delete + Cloudinary images |
| `toggleReviewVisibility(id)` | Admin | Flip `visible` flag |
| `addReviewImage(...)` | Admin | Save image |
| `deleteReviewImage(id)` | Admin | Delete from DB + Cloudinary |

### `actions/settings.ts`

| Function | Visibility | What it does |
|---|---|---|
| `getSettings()` | Public | Returns full `SiteSettings` object (with defaults for missing keys) |
| `getRawSettings()` | Admin | Returns raw key-value map |
| `updateSettings(updates)` | Admin | Batch upsert any settings |
| `updateDeliverySettings(data)` | Admin | Convenience wrapper |
| `updateSocialSettings(data)` | Admin | Convenience wrapper |
| `updateMessengerSettings(data)` | Admin | Convenience wrapper |
| `updateHomepageSettings(data)` | Admin | Convenience wrapper |
| `updateGeneralSettings(data)` | Admin | Convenience wrapper |

After every mutation, `revalidatePath()` is called on all affected routes so Next.js ISR cache is invalidated.

---

## 8. Page-by-Page Connection Map

### Customer Pages

#### `/` — Homepage
```
page.tsx
  ├── getSettings()          → SiteSettings
  ├── getProducts({ featured: true, pageSize: 6 })   → featured products
  ├── getProducts({ offerEnabled: true, pageSize: 4 }) → offer products
  └── getReviews({ visible: true })  → reviews

Renders:
  Hero           ← settings.heroTitle, settings.heroSubtitle
  FeaturedProducts ← featuredProducts[] + settings
  OffersSection  ← offerProducts[] + settings
  ReviewCarousel ← reviews[]
  AboutSection   ← settings.aboutText
  DeliveryInfo   ← settings.deliveryInsideDhaka / Outside
```

#### `/products` — Catalog
```
page.tsx
  ├── searchParams (URL: ?search=, ?category=, ?availability=, ?offer=, ?page=, ?sort=)
  ├── getSettings()
  ├── getProducts({ visible, search, categoryId, availability, offerEnabled, page, pageSize:12, sortBy })
  └── getCategories()

Renders:
  ProductCatalogClient (client component — manages filter state on client)
    ├── Filter controls (category, availability, offer toggle, sort)
    ├── ProductGrid → ProductCard[]
    └── Pagination
```

#### `/products/[slug]` — Product Detail
```
[slug]/page.tsx
  ├── getProductBySlug(slug) → ProductWithRelations | notFound()
  └── getSettings()

Renders:
  ProductGallery  ← product.images[]
  <video> tags    ← product.videos[]
  OfferBadge      ← discount %
  MessengerButton ← settings.messengerUrl + product.name pre-filled
  DeliveryInfo    ← compact mode
```

#### `/offers` — Offers
```
  getProducts({ visible: true, offerEnabled: true })
  → OffersSection component
```

#### `/reviews` — Reviews
```
  getReviews({ visible: true })
  → ReviewCard[] with star rating + optional images
```

#### `/about` — About
```
  getSettings() → settings.aboutText
```

#### `/delivery` — Delivery Info
```
  getSettings() → delivery charges, payment methods, description
```

---

### Admin Pages

#### `/admin/login` — Login (client component)
```
signIn('credentials', { email, password }) via next-auth/react
  → NextAuth authorize() → prisma.adminUser.findUnique() → bcrypt.compare()
  → JWT issued → redirect /admin
```

#### `/admin` — Dashboard
```
  getDashboardStats()
  → totalProducts, activeProducts, productsOnOffer, hiddenProducts,
     outOfStockProducts, totalReviews, visibleReviews

Renders:
  AdminHeader, StatsCard[] x8, QuickActions[], summary tables
```

#### `/admin/products` — Product Table
```
  getProducts() (all, admin view)
  → ProductsTable (search, filter, bulk actions)
```

#### `/admin/products/new` — Create Product
```
  getCategories()
  → ProductForm (mode="create")
      └── createProduct(data) Server Action
```

#### `/admin/products/[id]` — Edit Product
```
  getProductById(id) + getCategories()
  → ProductForm (mode="edit")
      ├── updateProduct(id, data)
      ├── addProductImage / deleteProductImage / setPrimaryImage
      └── addProductVideo / deleteProductVideo
      └── MediaUploader → /api/upload → Cloudinary
```

#### `/admin/reviews`, `/admin/reviews/new`, `/admin/reviews/[id]`
Same pattern: ReviewForm ↔ createReview / updateReview / addReviewImage / deleteReviewImage

#### `/admin/settings/*`
Each settings page loads `getRawSettings()` and renders the corresponding form:
- `GeneralSettingsForm` → `updateGeneralSettings()`
- `HomepageSettingsForm` → `updateHomepageSettings()`
- `DeliverySettingsForm` → `updateDeliverySettings()`
- `SocialSettingsForm` → `updateSocialSettings()`
- `MessengerSettingsForm` → `updateMessengerSettings()`

---

## 9. Component Dependency Graph

```
app/layout.tsx
  └── Toaster (sonner)

app/(customer)/layout.tsx
  ├── getSettings()
  ├── Navbar ← settings.messengerUrl
  └── Footer ← settings (social links, delivery, tagline)

app/admin/(dashboard)/layout.tsx
  ├── auth() [session check]
  └── AdminSidebar ← userEmail, uses next-auth/react signOut()

components/admin/ProductForm.tsx
  ├── react-hook-form + zodResolver(productFormSchema)
  ├── MediaUploader ← POST /api/upload ← generateSignature()
  ├── ImagePreviewGrid
  ├── Server Actions: createProduct | updateProduct
  │   addProductImage | deleteProductImage | setPrimaryImage
  │   addProductVideo | deleteProductVideo | generateUniqueSlug
  └── UI: Tabs, Card, Input, Label, Textarea, Switch, Button

components/customer/ProductGrid.tsx  (client component)
  ├── URL search params as filter state
  ├── ProductCard[] ← ProductWithRelations
  └── Pagination (URL-based)

components/admin/MediaUploader.tsx   (client component)
  ├── react-dropzone
  ├── fetch('/api/upload') to get Cloudinary signature
  └── fetch('https://api.cloudinary.com/…/upload') directly
```

---

## 10. Settings Key-Value Reference

All keys stored in the `settings` table:

| Key | Used By |
|---|---|
| `site_name` | SEO metadata, general |
| `tagline` | Footer, homepage meta |
| `hero_title` | Hero section |
| `hero_subtitle` | Hero section, meta description |
| `about_text` | About page + section |
| `delivery_inside_dhaka_charge` | Footer, DeliveryInfo |
| `delivery_inside_dhaka_payment` | Footer, DeliveryInfo |
| `delivery_outside_dhaka_charge` | Footer, DeliveryInfo |
| `delivery_outside_dhaka_payment` | Footer, DeliveryInfo |
| `delivery_description` | Delivery page |
| `messenger_url` | Navbar CTA, MessengerButton, Footer |
| `messenger_default_message` | MessengerButton pre-fill |
| `facebook_url` | Footer, SocialLinks |
| `instagram_url` | Footer, SocialLinks |
| `tiktok_url` | Footer, SocialLinks |

---

## 11. Validation Layer (Zod Schemas)

All form data is validated via Zod schemas in `lib/validations.ts` **before** any DB write:

| Schema | Used In |
|---|---|
| `productFormSchema` | `ProductForm` + `createProduct`/`updateProduct` actions |
| `reviewFormSchema` | `ReviewForm` + `createReview`/`updateReview` actions |
| `deliverySettingsSchema` | `DeliverySettingsForm` |
| `socialSettingsSchema` | `SocialSettingsForm` |
| `messengerSettingsSchema` | `MessengerSettingsForm` |
| `homepageSettingsSchema` | `HomepageSettingsForm` |
| `generalSettingsSchema` | `GeneralSettingsForm` |
| `loginSchema` | `AdminLoginPage` |
| `categorySchema` | Category creation inline in `ProductForm` |

---

## 12. SEO Setup

| File | Purpose |
|---|---|
| `app/layout.tsx` | Global Open Graph, Twitter card, robots meta |
| `app/robots.ts` | Disallows `/admin/` and `/api/` from crawlers |
| `app/sitemap.ts` | Dynamic XML sitemap — includes all visible product slugs |
| `app/(customer)/products/[slug]/page.tsx` | Per-product `generateMetadata()` with OG image from first product image |
| `app/(customer)/page.tsx` | Homepage `generateMetadata()` from DB settings |

---

## 13. Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma pooled connection (Neon) |
| `DATABASE_DIRECT_URL` | Prisma direct connection (migrations) |
| `AUTH_SECRET` | NextAuth JWT signing secret |
| `NEXTAUTH_URL` | Full public app URL |
| `ADMIN_EMAIL` | Seed script only — initial admin email |
| `ADMIN_PASSWORD` | Seed script only — initial admin password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary config (server-side) |
| `CLOUDINARY_API_KEY` | Cloudinary config (server-side) |
| `CLOUDINARY_API_SECRET` | Cloudinary config (NEVER exposed to browser) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Browser-safe cloud name |
| `NEXT_PUBLIC_APP_URL` | Used in sitemap, OG URLs |

> ⚠️ The `.env` file contains real credentials (DB URL, Cloudinary API secret, admin password). This file **must not be committed to Git**. Add `.env` to `.gitignore` immediately if not already done.

---

## 14. Data Flow Summary (Full Stack)

```
[Customer Browser]
      │
      │ HTTP GET /products
      ▼
[Next.js Server — RSC]
      │ getProducts({ visible: true })
      ▼
[Prisma Client]
      │ SELECT ... FROM products WHERE visible = true ORDER BY displayOrder
      ▼
[Neon PostgreSQL (cloud)]
      │ rows + joined images/videos/category
      ▼
[Server renders HTML]
      │
      ▼
[Browser receives HTML + hydrates client components]

---

[Admin Browser]
      │
      │ Drops image file in MediaUploader
      ▼
[Client: fetch POST /api/upload]
      │
      ▼
[Next.js Route Handler — auth check]
      │ generateSignature(folder)
      ▼
[Client: fetch POST api.cloudinary.com/upload + signed token]
      │
      ▼
[Cloudinary CDN] → returns { secure_url, public_id }
      │
      ▼
[Client calls Server Action: addProductImage(productId, url, publicId)]
      │
      ▼
[Prisma: INSERT INTO product_images]
      │ revalidatePath('/admin/products/[id]')
      ▼
[Page re-renders with new image]
```

---

## 15. Notable Design Decisions

1. **No shopping cart** — Orders are placed via Facebook Messenger. The site's primary CTA everywhere is "Order via Messenger."
2. **Key-value settings store** — All editable copy (hero text, delivery charges, social URLs) lives in the DB `settings` table, not in code. Zero re-deployment needed for content changes.
3. **Cloudinary signed upload** — API secret stays on the server; the browser gets a one-time signature. This is the correct pattern.
4. **Dual auth guard** — Both `middleware.ts` and the admin layout double-check authentication, preventing edge cases where middleware is bypassed.
5. **Graceful DB fallbacks** — All server actions catch DB errors and return empty data rather than crashing, so the site degrades gracefully if the DB is unreachable.
6. **Slug-based product URLs** — Products use human-readable slugs (`/products/premium-canvas-wallet`) with auto-generation + collision resolution.
7. **`displayOrder` throughout** — Products, product images, product videos, and reviews all have a `displayOrder` field, enabling full admin control over display sequence.
8. **Server Components by default** — Customer pages are fully server-rendered for SEO. Only interactive components (Navbar, ProductGrid filters, ProductForm, MediaUploader, AdminSidebar) are client components.

---

*Generated by Antigravity audit — October 2026*
