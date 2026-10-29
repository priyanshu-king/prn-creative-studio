# PRN — Creative Design Platform

A professional browser-based creative design platform built with React 19, Fabric.js 7, and Vite 8.

![PRN Design Platform](./src/assets/hero.png)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint

# Netlify deployment
npm run build  # First build the project
# Then deploy the `dist` folder to Netlify
```

---

## Architecture

```
prn-editor/
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── EditorTopbar.jsx   # Top bar with title, undo/redo, export
│   │   │   ├── LeftPanel.jsx      # Tab panel: Elements, Text, Uploads, Templates, Pages, Layers
│   │   │   └── PropertiesPanel.jsx # Right-side contextual object properties
│   │   └── shared/
│   │       ├── Nav.jsx            # Global navigation bar
│   │       └── Footer.jsx         # Global footer
│   ├── hooks/
│   │   └── useCanvasHistory.js    # Undo/redo with JSON snapshots (max 50)
│   ├── pages/
│   │   ├── LandingPage.jsx + .css # Marketing home page
│   │   ├── DashboardPage.jsx      # Project management
│   │   ├── EditorPage.jsx         # Main canvas editor
│   │   ├── FeaturesPage.jsx       # Features directory
│   │   ├── TemplatesPage.jsx      # Template gallery
│   │   ├── PricingPage.jsx        # Pricing with monthly/annual toggle
│   │   ├── AboutPage.jsx          # About PRN
│   │   ├── HelpPage.jsx           # Help center with searchable FAQ
│   │   ├── LoginPage.jsx          # Sign in
│   │   ├── SignupPage.jsx         # Create account
│   │   ├── AccountPage.jsx        # Profile, billing, security
│   │   ├── PrivacyPage.jsx        # Privacy policy
│   │   ├── TermsPage.jsx          # Terms of service
│   │   └── NotFoundPage.jsx       # 404
│   ├── store/
│   │   └── useAppStore.js         # Zustand store: auth, projects, brand kit, UI
│   ├── App.jsx                    # React Router routes
│   ├── App.css                    # Design system: tokens, buttons, cards, editor layout
│   └── index.css                  # CSS custom properties, global reset
├── public/
│   └── favicon.svg
├── RELEASE_CHECKLIST.md           # Phase completion tracker
└── README.md                      # This file
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Landing page |
| `/features` | Features directory |
| `/templates` | Template gallery |
| `/pricing` | Pricing |
| `/about` | About |
| `/help` | Help center |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/login` | Sign in |
| `/signup` | Create account |
| `/account` | Account settings |
| `/dashboard` | Design dashboard |
| `/editor/:id` | Canvas editor for a design |

---

## Core Features

### Editor
- Fabric.js 7 canvas with full object manipulation
- Shapes: Rectangle, Circle, Triangle, Line, Star, Arrow
- Text: editable IText with font family, size, weight, alignment, style
- Images: upload PNG/JPG/GIF/WebP/SVG, flip, rotate, opacity
- Undo/redo: JSON snapshot history (up to 50 states)
- Keyboard: `Delete`, `Ctrl+Z/Y`, `Ctrl+D` duplicate, `Ctrl+S` save, `Ctrl+A` select all, arrow nudge
- Alignment: left/center/right/top/middle/bottom via toolbar
- Layers panel: visibility toggle, object list
- Multi-page documents: add, duplicate, switch pages
- Zoom: 10%–400% with reset
- Autosave every 3 seconds after changes

### Export
- PNG (2× resolution)
- JPG (2× resolution, 0.92 quality)
- PDF (jsPDF, canvas dimensions preserved)
- SVG (Fabric.js native)

### Templates
- 16 starter templates across 8 categories
- Search and category filter on /templates page
- Load template into editor

### Business Features (Architecture Ready)
- Free vs Pro plan model documented
- Pricing page with transparent feature comparison
- User account with plan badge
- Brand Kit data structure in store

---

## State Management

**Zustand** with localStorage persistence (`prn-app-storage` key):
- `user` — authenticated user (name, email, plan)
- `projects` — array of design projects with pages, canvas JSON, thumbnails
- `brandKit` — saved colors, fonts, logos
- `ui` — editor sidebar tab, grid/guide toggles

---

## Current Limitations & Production Requirements

> See `RELEASE_CHECKLIST.md` for the complete status of every feature.

**This is a frontend-only implementation.** For production:

1. **Backend API** — Node.js/Next.js for auth, project storage, entitlements
2. **Password hashing** — bcrypt/argon2 (NOT plain text localStorage)
3. **Database** — PostgreSQL or similar for persistent storage
4. **Email service** — Email verification, password reset
5. **File storage** — S3/R2 for uploaded images and project assets
6. **Payment processing** — Razorpay (India) or Stripe, test mode first
7. **AI features** — OpenAI/Stability API keys stored server-side only

---

## Design System

CSS custom properties in `src/index.css`:
- `--prn-primary: #5b50d6` (brand indigo)
- `--prn-accent: #e84393` (brand pink)
- Neutral grays from `--gray-50` to `--gray-900`
- Shadow scale: `--shadow-xs` through `--shadow-xl`
- Border radius: `--radius-sm` through `--radius-full`
- Transition speeds: `--ease-fast`, `--ease-std`, `--ease-slow`

Fonts:
- Body: Inter (Google Fonts CDN)
- Display: Plus Jakarta Sans (Google Fonts CDN)

---

## License

© 2026 PRN Design Platform. All rights reserved.

Templates included in this project are original starter designs created for PRN.
Third-party libraries (Fabric.js, React, jsPDF, Zustand) are subject to their respective licences.


---

## Deployment

### Netlify Deployment

1. **Build the project first:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder
   - Or connect your Git repository

3. **Environment variables** (optional for future backend):
   ```
   VITE_API_URL=https://your-backend-api.com
   ```

4. **The site will be automatically deployed** with:
   - SPA routing support (via `netlify.toml`)
   - Asset caching optimizations
   - Automatic HTTPS

### Other Hosting Options

- **Vercel**: Works similarly to Netlify
- **GitHub Pages**: Requires setting base path in `vite.config.js`
- **Cloudflare Pages**: Good for global CDN
- **AWS S3 + CloudFront**: For maximum control

---

## Support

For deployment issues:
1. Ensure `dist` folder contains `index.html` and assets
2. Check browser console for errors
3. Verify SPA redirects are working (all routes should serve `index.html`)
4. Clear browser cache if experiencing old version

---

## Changelog

- **October 2026**: Complete frontend rescue and transformation
- Production build: ✅ 9.16s, zero errors
- All lint errors fixed
- Original PRN brand identity established
- Ready for backend integration (Phase 7)