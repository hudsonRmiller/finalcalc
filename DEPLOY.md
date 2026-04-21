# FinalCalc — Deployment Guide

Everything is built. Follow these steps to go live.

---

## Step 1: Get this onto GitHub (~3 min)

```bash
# In your terminal, wherever you keep projects:
cd ~/projects  # or wherever
cp -r /path/to/this/finalcalc .
cd finalcalc

git init
git add .
git commit -m "initial commit"

# Create a repo on github.com called "finalcalc" (public or private, doesn't matter)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/finalcalc.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel (~2 min)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New → Project"**
3. Import your `finalcalc` repo
4. Vercel auto-detects Vite — leave all defaults
5. Click **Deploy**
6. Your site is now live at `finalcalc.vercel.app` (free, with HTTPS, globally distributed)

## Step 3: Buy a domain (~5 min, ~$8–12)

Good options to check on Namecheap, Porkbun, or Cloudflare Registrar:
- `whatdoineedonmyfinal.com`
- `finalcalc.app`
- `finalgradecheck.com`
- `myfinalcalc.com`

After purchasing:
1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your custom domain
3. Vercel gives you DNS records (usually a CNAME)
4. Add those records in your domain registrar's DNS settings
5. Wait ~5 min for propagation. Done.

## Step 4: Set up Google AdSense (~10 min to apply, days to approve)

1. Go to [adsense.google.com](https://adsense.google.com)
2. Sign up / sign in with a Google account
3. Add your site URL
4. Google gives you a publisher ID like `ca-pub-1234567890123456`
5. In `index.html`, uncomment the AdSense script line and replace `ca-pub-XXXXXXXXXXXXXXXX` with your ID
6. In `src/App.jsx`, find the `AdSlot` component and replace `ca-pub-XXXXXXXXXXXXXXXX` there too
7. Google will review your site (can take 1–14 days)
8. Once approved, ads auto-fill into the 3 slots already placed in the app

**Note:** AdSense approval requires some real content and a privacy policy page. You can add a simple `/privacy` route later, or just link to a Google Doc. Google also wants to see some organic traffic, so start promoting immediately (see Step 6).

## Step 5: Google Analytics (optional, ~3 min)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a GA4 property for your domain
3. Get your Measurement ID (starts with `G-`)
4. Uncomment the GA block in `index.html` and replace `G-XXXXXXXXXX`

## Step 6: Drive traffic (ongoing, this is the actual work)

Immediate (this week, finals season):
- Post on r/college, r/university, r/studying, r/professors — "I built this during finals week"
- Share in your school's GroupMe / Discord channels
- Text it to friends and ask them to share
- Post on Twitter/X: "built a final grade calculator during my own finals week lol"

SEO (compounds over time):
- Your meta tags are already optimized for "what do I need on my final" and "final grade calculator"
- Submit your sitemap to Google Search Console (search.google.com/search-console)
- Write a single blog post (can add a `/blog` route later) targeting the same keywords

The traffic for these search terms spikes predictably every May and December. Once you're indexed, it's autopilot.

---

## File structure

```
finalcalc/
├── index.html          ← SEO meta, AdSense/GA script tags
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx        ← React entry
    └── App.jsx         ← The entire app + ad slots
```

## After deploying: find-and-replace checklist

Search for `YOUR_DOMAIN_HERE` across all files and replace with your actual domain:
- `index.html` (canonical URL, OG tags)
- `public/robots.txt`
- `public/sitemap.xml`

Search for `ca-pub-XXXXXXXXXXXXXXXX` and replace with your AdSense publisher ID:
- `index.html`
- `src/App.jsx`

Search for `G-XXXXXXXXXX` and replace with your GA4 measurement ID:
- `index.html`

---

Total time from reading this to live site: ~20 minutes.
Total cost: ~$10 for a domain. Everything else is free.
