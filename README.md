# DK Dance Company (DKDC) — Official Web Platform & CMS

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![UploadThing](https://img.shields.io/badge/UploadThing-Cloud%20Storage-red)](https://uploadthing.com/)

> **Website:** [www.dkdancecompany.com](https://www.dkdancecompany.com)  
> **Artistic Director:** Dhanesh Krishnan  
> **Head Office:** Kozhikode, Kerala, India  
> **International Studio:** Bournemouth, United Kingdom  
> **Institutional Tagline:** Learn • Train • Perform • Grow

---

## 1. Overview

**DK Dance Company (DKDC)** is a premier international dance training institution founded by Artistic Director Dhanesh Krishnan. The academy operates physical studios across Kozhikode, Kerala, an international branch in Bournemouth, United Kingdom, and live interactive digital classes for students worldwide.

This repository contains the complete production source code for the official DK Dance Company web platform. It is engineered with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, MongoDB Atlas, and UploadThing cloud media storage. The platform combines an editorial contemporary dance presentation with a database-driven administrative CMS.

---

## 2. Key Capabilities & Features

### 2.1 Public Experience
- **Cinematic Hero:** High-definition video hero banner with smooth parallax gliding.
- **Brand Story & Philosophy:** Comprehensive institutional profile and vision by Director Dhanesh Krishnan.
- **Dynamic Background Transition:** Viewport-scroll background lighting animation on the milestone statistics section.
- **Dance Disciplines & Syllabi:** Dynamic curriculum showcasing Bollywood, Hip-Hop, Contemporary, Lyrical, Western, and Freestyle dance, along with kinetic conditioning modules.
- **Physical Studio Directory:** Dedicated branch pages (`/branches/[slug]`) featuring verified Google Maps integration, batch timings, local contact info, and studio photography.
- **Worldwide Online Academy:** International training information (`/online-classes`) supporting students across global time zones.
- **Admission Consultation Form:** Multi-step enquiry form with dynamic branch and dance style options, automated honeypot spam protection, and WhatsApp lead notifications.
- **Media Showcase & Lightbox:** Filterable gallery featuring high-resolution performance photos, stage production reels, and video playback modals.
- **Student Reviews:** Verified testimonials with star ratings and student feedback.
- **Instant WhatsApp Integration:** Floating contact button connecting visitors directly to administration.

### 2.2 Administrative Control Panel (`/admin`)
- **Secure Authentication:** JWT-based session security delivered via HTTP-only cookies (`dkdc_session`), bcrypt password hashing, and IP rate limiting.
- **Admission Leads Manager (`/admin/enquiries`):** Real-time inbox for student inquiries with status tracking (New, Contacted, Enrolled, Closed) and 1-click WhatsApp follow-ups.
- **Branch Studios Manager (`/admin/branches`):** Full CRUD for studio locations, addresses, Google Maps links, class timetables, and cover images.
- **Dance Styles Manager (`/admin/dance-styles`):** Manage styles, syllabi bullet points, display order, and promo artwork. Styles dynamically populate the public enquiry form.
- **Conditioning Curriculum Manager (`/admin/curriculum`):** Manage foundational conditioning and kinetic drilling modules.
- **Media Library (`/admin/media`):** Direct drag-and-drop cloud file uploads via UploadThing with automated cleanup on deletion.
- **Featured Videos Manager (`/admin/videos`):** Manage homepage video showcases and stage performance clips.
- **Reviews Manager (`/admin/reviews`):** Manage student testimonials, star ratings, and verified badges.
- **Cloud Storage Analytics (`/admin/storage`):** Visual metrics on cloud asset count, storage allocation, and UploadThing usage.
- **Site Settings CMS (`/admin/settings`):** Manage contact numbers, fee structures, mission/vision copy, and social links in real time.
- **Password Manager (`/admin/change-password`):** Secure self-service password update for administrative accounts.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) with custom design tokens |
| **Motion** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with native connection pooling |
| **Cloud Storage** | [UploadThing](https://uploadthing.com/) for photos and video assets |
| **Auth & Security** | [jose](https://github.com/panva/jose) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) + HTTP-only cookies |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 4. Getting Started

### 4.1 Prerequisites
- **Node.js:** v18.17.0 or v20.x or later
- **npm:** v9.x or later
- **Git**
- **MongoDB Atlas Cluster** (or local MongoDB instance)
- **UploadThing Account** (for media uploads)

### 4.2 Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dk-dance-company.git
cd dk-dance-company

# 2. Install dependencies
npm install
```

### 4.3 Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Populate the required environment variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=dkdancecompany

# Cloud Media Storage (UploadThing)
UPLOADTHING_TOKEN=your_uploadthing_token_here
UPLOADTHING_SECRET=your_uploadthing_secret_here

# Administrator Credentials & Security
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_JWT_SECRET=your_minimum_32_character_random_secret_key_here

# Public Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=919995272083
NEXT_PUBLIC_CONTACT_PHONE=+91 9995 272 083
NEXT_PUBLIC_CONTACT_EMAIL=info@dkdancecompany.com
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/dkdancecompany
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/dkdancecompany
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@dkdancecompany
```

### 4.4 Running the Application

```bash
# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 5. Environment Variables Guide

| Variable | Description | Exposure |
|---|---|---|
| `MONGODB_URI` | Full connection URI for MongoDB Atlas cluster | Server only |
| `MONGODB_DB_NAME` | Target database name (`dkdancecompany`) | Server only |
| `UPLOADTHING_TOKEN` | UploadThing app token for cloud media processing | Server only |
| `UPLOADTHING_SECRET` | UploadThing secret key | Server only |
| `ADMIN_USERNAME` | Master administrator username | Server only |
| `ADMIN_PASSWORD` | Master administrator password | Server only |
| `ADMIN_JWT_SECRET` | 32+ character key used to sign and verify session JWTs | Server only |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of the website | Public |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Contact phone digits (without `+`) for WhatsApp links | Public |
| `NEXT_PUBLIC_CONTACT_PHONE` | Formatted contact phone number displayed in UI | Public |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Official email address displayed in UI | Public |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL | Public |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page URL | Public |
| `NEXT_PUBLIC_YOUTUBE_URL` | YouTube channel URL | Public |

---

## 6. Database Architecture

The application connects to MongoDB Atlas using a cached client singleton (`src/lib/mongodb.ts`) to prevent connection exhaustion in serverless environments.

### 6.1 Core Collections
- **`site_settings`:** Global website metadata, tuition fee structures, mission, vision, and hero video configuration.
- **`branches`:** Physical studio locations, addresses, Google Maps URLs, contact numbers, schedules, and photos.
- **`dance_styles`:** Dance genres, curriculum bullet points, descriptions, and cover artwork.
- **`curriculum_modules`:** Conditioning modules, body mechanics drills, and flexibility routines.
- **`media`:** Photos and video clips for the public media library.
- **`videos`:** Curated showcase and performance video reels.
- **`reviews`:** Student testimonials, ratings, and verification status.
- **`enquiries`:** Leads submitted through the public admission form.
- **`admin_users`:** Salted and hashed credentials for admin authentication.

### 6.2 Offline Resilience
If `MONGODB_URI` is not provided or the network is unavailable during local development, the service layer (`src/lib/db-services.ts`) automatically falls back to curated in-memory mock datasets so UI work is never blocked by database outages.

### 6.3 Database Seeding
To initialize a fresh database with default branches, settings, and curriculum data, trigger the idempotent seed endpoint:

```bash
curl -X POST http://localhost:3000/api/seed
```

---

## 7. Media Infrastructure (UploadThing)

Image and video uploads are managed through UploadThing:
- **Photos (`imageUploader`):** Up to 8MB per file, maximum 4 files per batch.
- **Videos (`videoUploader`):** Up to 64MB per file.
- **Security:** Upload routes enforce server-side session checks; unauthorized uploads are rejected.
- **Automated Deletion:** Deleting an item in the admin panel invokes `utapi.deleteFiles()`, purging the asset from cloud storage to prevent orphaned files and unnecessary storage costs.

---

## 8. Project Structure

```
├── public/
│   └── images/                       # Static public brand assets
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/                # Institutional profile & Director Dhanesh Krishnan
│   │   │   ├── dance-styles/         # Dance disciplines catalog
│   │   │   ├── classes/              # Class levels & fee structure
│   │   │   ├── branches/             # Studio branches directory & [slug] dynamic pages
│   │   │   ├── online-classes/       # Global digital masterclasses
│   │   │   ├── gallery/              # Filterable media library & video modal
│   │   │   ├── contact/              # Admissions & contact page
│   │   │   ├── rules/                # Studio regulations & guidelines
│   │   │   ├── privacy/              # Privacy policy
│   │   │   └── terms/                # Terms and conditions
│   │   ├── admin/
│   │   │   ├── login/                # Admin authentication portal
│   │   │   ├── page.tsx              # Analytics & leads summary dashboard
│   │   │   ├── enquiries/            # Admission leads manager
│   │   │   ├── branches/             # Branch studios CRUD
│   │   │   ├── dance-styles/         # Dance styles CRUD
│   │   │   ├── curriculum/           # Conditioning curriculum CRUD
│   │   │   ├── media/                # Media library manager
│   │   │   ├── videos/               # Featured video reels manager
│   │   │   ├── reviews/              # Student reviews manager
│   │   │   ├── storage/              # Cloud storage usage analytics
│   │   │   ├── settings/             # Dynamic website settings CMS
│   │   │   └── change-password/      # Admin password management
│   │   └── api/
│   │       ├── auth/                 # Login, logout, session verification
│   │       ├── branches/             # Branch APIs
│   │       ├── dance-styles/         # Dance style APIs
│   │       ├── curriculum/           # Conditioning module APIs
│   │       ├── media/                # Media library APIs
│   │       ├── videos/               # Featured video APIs
│   │       ├── reviews/              # Review APIs
│   │       ├── enquiries/            # Admission submission & management APIs
│   │       ├── settings/             # Dynamic site settings APIs
│   │       ├── storage/              # Storage usage & stats API
│   │       ├── seed/                 # Database seed route
│   │       └── uploadthing/          # FileRouter endpoints
│   ├── components/
│   │   ├── admin/                    # Admin sidebar, header, confirm modals
│   │   ├── forms/                    # Admission contact form
│   │   ├── gallery/                  # Lightbox, gallery marquee, video player
│   │   ├── home/                     # Lower homepage suspense stream
│   │   ├── layout/                   # Global Navbar, Footer
│   │   ├── sections/                 # Hero, Intro, Stats, Styles, Branches, Reviews, CTA
│   │   └── ui/                       # Buttons, modals, motion primitives, notifications
│   ├── context/                      # Global Toast & Notification context
│   ├── lib/
│   │   ├── auth.ts                   # JWT session management & rate limiting
│   │   ├── constants.ts              # Confirmed studio constants & fallback data
│   │   ├── db-services.ts            # Data access layer & queries
│   │   ├── mongodb.ts                # Cached MongoDB Atlas client
│   │   └── uploadthing.ts            # UTApi cloud file deletion helper
│   ├── middleware.ts                 # Route protection for /admin routes
│   └── types/
│       └── index.ts                  # TypeScript domain models & interfaces
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 9. Production Build & Deployment

### 9.1 Local Production Test

```bash
# 1. Type check codebase
node ./node_modules/typescript/bin/tsc --noEmit

# 2. Compile optimized production build
npm run build

# 3. Start production server
npm run start
```

### 9.2 Vercel Deployment

1. Push your changes to GitHub or GitLab.
2. Link the repository in [Vercel Dashboard](https://vercel.com).
3. Set Framework Preset to **Next.js**.
4. Configure all environment variables from Section 4.3 in **Project Settings > Environment Variables**.
5. Ensure `ADMIN_JWT_SECRET` is at least 32 characters long.
6. Deploy the project. The build runs automatically and static/ISR routes are published instantly.

---

## 10. Operational Guidelines

### 10.1 Managing Dance Styles
- Go to `/admin/dance-styles`.
- Add, update, or remove styles.
- Active dance styles automatically update on the homepage styles curriculum, the dedicated `/dance-styles` page, and the public enquiry form dropdown across all pages.

### 10.2 Managing Branches
- Go to `/admin/branches`.
- Enter studio name, physical address, verified Google Maps link, phone number, and timings.
- Upload a studio photograph via UploadThing.
- Updates reflect immediately on `/branches` and `/branches/[slug]`.

### 10.3 Managing Enquiries
- Inquiries submitted through the website appear instantly at `/admin/enquiries`.
- Admins can update status (`New`, `Contacted`, `Enrolled`, `Closed`) or click the WhatsApp action button to directly begin a conversation with the prospective student with a pre-filled greeting message.

---

## 11. Security Architecture

- **HTTP-Only Cookies:** Auth tokens are stored in `dkdc_session` cookies with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production) flags, mitigating XSS token theft.
- **Fail-Closed Auth:** In production mode, authentication endpoints fail closed if `ADMIN_JWT_SECRET` is missing or below 32 characters.
- **Input Sanitization:** Contact forms validate phone numbers, email regexes, and use silent honeypot rejection to filter automated bot traffic.
- **Rate Limiting:** In-memory sliding window rate limiting restricts brute-force attempts on sensitive authentication routes.

---

## 12. License & Ownership

© 2026 **DK Dance Company (DKDC)**. All rights reserved.  
Artistic Director & Head Choreographer: **Dhanesh Krishnan**.
