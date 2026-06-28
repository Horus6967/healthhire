# HealthHire Setup Guide

## Prerequisites
- Node.js (installed via Homebrew at /opt/homebrew/bin/node)
- A Clerk account (clerk.com)
- A Supabase account (supabase.com)
- A Resend account (resend.com)
- ngrok (for local webhook testing)

---

## Step 1: Install dependencies
```bash
export PATH="/opt/homebrew/bin:$PATH"
cd ~/healthhire
npm install
```

## Step 2: Fill in .env.local
See the walkthrough below for each key.

## Step 3: Push database schema
```bash
npx prisma db push
```

## Step 4: Run locally
```bash
npm run dev
```
Then open http://localhost:3000

---

## Getting your API keys

### Clerk
1. Go to clerk.com → Dashboard → Create application
2. Copy "Publishable Key" → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
3. Copy "Secret Key" → CLERK_SECRET_KEY
4. For CLERK_WEBHOOK_SECRET: see Webhook section below

### Supabase
1. Go to supabase.com → New project
2. Go to Project Settings → Database → Connection string → URI mode
3. Copy the connection string → DATABASE_URL
   (Replace [YOUR-PASSWORD] with your database password)

### Resend
1. Go to resend.com → API Keys → Create API Key
2. Copy → RESEND_API_KEY

---

## Setting up the Clerk Webhook

The webhook syncs new user signups into your database.

### Local testing with ngrok
```bash
# Install ngrok if needed
brew install ngrok

# Start your dev server first
npm run dev

# In a new terminal, expose it
ngrok http 3000
```

Copy the ngrok URL (e.g. https://abc123.ngrok.io)

In Clerk Dashboard:
1. Go to Webhooks → Add Endpoint
2. URL: https://your-ngrok-url.ngrok.io/api/webhooks/clerk
3. Subscribe to: user.created
4. Copy the "Signing Secret" → CLERK_WEBHOOK_SECRET in .env.local

---

## Installing svix (needed for webhook verification)
```bash
npm install svix
```
