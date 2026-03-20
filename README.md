# GrowthsterAI — Landing Page

AI-powered marketing automation platform. Single-page marketing site and waitlist capture.

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Create environment file
```bash
cp .env.example .env.local
```
Then edit `.env.local` and add your Apps Script URL:
```
VITE_SHEET_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

### 3. Add your video files to `/public/videos/`
- `hero-brand-film.mp4`
- `product-demo.mp4`

> Without these files the hero and platform sections show placeholder UI — the site still builds and functions correctly.

### 4. Add your image files to `/public/images/`
- `feature-brand-intel.png`
- `feature-creative-studio.png`
- `feature-command-center.png`
- `feature-analytics.png`
- `feature-automation.png`
- `step-1.png`
- `step-2.png`
- `step-3.png`

> Without these files the Features and Process sections show filename placeholders — the site still builds and functions correctly.

### 5. Run development server
```bash
npm run dev
```
Opens at [http://localhost:5173](http://localhost:5173)

### 6. Build for production
```bash
npm run build
```
Output in `/dist/`

---

## Deploy to Vercel

### Method 1 — Vercel CLI (recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. From the project root, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: your account
   - Link to existing project: `N`
   - Project name: `growthsterai`
   - Directory: `./`
   - Override settings: `N`

4. Add environment variable:
   ```bash
   vercel env add VITE_SHEET_URL
   ```
   Paste your Apps Script URL when prompted.
   Select: **Production, Preview, Development**.

5. Redeploy with the env variable:
   ```bash
   vercel --prod
   ```

6. Your site is live at `https://growthsterai.vercel.app`

---

### Method 2 — GitHub + Vercel Dashboard

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/growthsterai.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project**

3. Import your GitHub repository

4. Vercel auto-detects Vite. Confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Before clicking Deploy, go to the **Environment Variables** section:
   - Key: `VITE_SHEET_URL`
   - Value: your full Apps Script URL
   - Apply to: **Production, Preview, Development**

6. Click **Deploy**.

7. Vercel builds and deploys automatically. Your site is live in ~60 seconds.

---

### Method 3 — Drag and Drop (quickest test)

1. Run: `npm run build`
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Drag the `/dist` folder directly onto the Vercel upload area.

> **NOTE:** Environment variables do not work with drag and drop. The form will not submit until you add `VITE_SHEET_URL` via the Vercel dashboard and redeploy.

---

## Custom Domain

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add your domain (e.g. `growthsterai.app`)
3. Vercel provides DNS records — add them to your domain registrar:
   - Type: `A`, Value: `76.76.19.61`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
4. SSL certificate is provisioned automatically by Vercel. HTTPS is enforced by default.
5. DNS propagation takes between 5 minutes and 48 hours depending on your registrar.

---

## Updating after deployment

Every git push to `main` automatically triggers a new Vercel deployment if connected via GitHub. The site updates in ~30 seconds.

To update manually via CLI:
```bash
vercel --prod
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_SHEET_URL` | Google Apps Script web app URL for waitlist form submissions | Yes (for form to work) |

> This variable must never be committed to git. It is in `.gitignore` via `.env.local`. Add it in the Vercel dashboard for production.

---

## Project Structure

```
growthsterai-landing/
├── index.html              # Single HTML entry point
├── package.json            # Project config and scripts
├── vite.config.js          # Vite build configuration
├── vercel.json             # Vercel routing + headers
├── .gitignore              # Ignores node_modules, dist, .env files
├── .env.example            # Committed env template (no secrets)
├── .env.local              # Local secrets (gitignored)
├── README.md               # This file
├── public/
│   ├── videos/
│   │   ├── hero-brand-film.mp4   # Hero background video (add yours)
│   │   └── product-demo.mp4      # Platform demo video (add yours)
│   └── images/
│       ├── feature-brand-intel.png
│       ├── feature-creative-studio.png
│       ├── feature-command-center.png
│       ├── feature-analytics.png
│       ├── feature-automation.png
│       ├── step-1.png
│       ├── step-2.png
│       └── step-3.png
└── src/
    ├── main.js             # Entry point — imports CSS and form.js
    ├── style.css           # All CSS — design system + components
    └── form.js             # Waitlist form validation and submission
```

---

## Google Apps Script Setup

To receive waitlist form submissions in Google Sheets:

1. Create a new Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Paste this script:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.company,
    data.title,
    data.size,
    data.spend,
    data.source
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy** → **New deployment**
5. Type: **Web app**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy** and copy the web app URL
9. Paste it into your `.env.local` as `VITE_SHEET_URL`
10. Add the same URL to Vercel environment variables

---

*GrowthsterAI © 2026*
