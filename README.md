# BooyahIQ — Win Smarter. Play Harder.

A Free Fire gaming intelligence platform built with Next.js 14.

## Features

- **Authentication** — Email/password login with NextAuth.js, email verification, password reset
- **Player Profile** — Stats dashboard, avatar upload, AI-powered screenshot extraction
- **Guild System** — Create/join guilds, invite links, roles (Leader/Officer/Member)
- **Real-time Chat** — Pusher-powered guild chat with channels, typing indicators
- **Esports Hub** — Tournament cards with status filters, region filters, contact manager
- **Player Search** — Search by name or UID with region filter, rate limiting for free users
- **Subscription** — Razorpay (India ₹99/month) + Stripe (International) with webhooks
- **Coming Soon** — Meta Reports, Guides & Blog, Admin Dashboard, Sponsorships

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: Neon.tech PostgreSQL + Prisma 7 ORM
- **Auth**: NextAuth.js with JWT sessions
- **Real-time**: Pusher (free sandbox)
- **Email**: Mailgun
- **Storage**: Cloudinary
- **AI**: OpenAI GPT-4o Vision
- **Payments**: Razorpay + Stripe
- **Monitoring**: Sentry + Datadog

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Push the database schema:
   ```bash
   npx prisma migrate deploy
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

Deploy to Vercel. Connect your GitHub repository and add the environment variables from `.env.example`.
