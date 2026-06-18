# 💼 Sam Portfolio — AI-First Full-Stack Engineer

## 🌐 Deployed Sites
- **Frontend App:** [https://sam-porfolio-front.vercel.app](https://sam-porfolio-front.vercel.app)
- **Backend API:** [https://sam-porfolio-back.vercel.app](https://sam-porfolio-back.vercel.app)

---

## 👤 About

**Sam** — AI-First Full-Stack Engineer with **5+ years** of production experience building scalable web applications, streaming platforms, enterprise dashboards, gaming portals, and community platforms.

- 🔗 **GitHub:** [github.com/ZETIC7Z](https://github.com/ZETIC7Z)
- 📺 **YouTube:** [@ZETICUZ](https://www.youtube.com/@ZETICUZ)
- 📧 **Email:** [samxerz.zeticuz@gmail.com](mailto:samxerz.zeticuz@gmail.com)
- 📍 **Location:** Cebu City, Philippines

---

## 🚀 Key System Features

We have refactored this project into a decoupled architecture containing a modern Vite/React frontend and a serverless Node.js backend.

### 1. Serverless Node.js Backend (`backend/api`)
- Serverless API handlers deployed directly on Vercel handling JWT authentication, portfolio administration, Vercel Blob integrations, and AI tasks.

### 2. Vercel Blob Database Integrations
- Zero-database setup! All project records are saved as a structured JSON database file (`projects/projects.json`) stored and loaded directly from Vercel Blob.
- Support for uploading and deleting CV/Resume PDF files and project screenshots.

### 3. AI-Powered Project Auto-fill (`/api/github-analyze`)
- Extracts metadata and tech stack information from any public GitHub repository URL.
- Uses **OpenRouter API** (`openrouter/free`) to analyze repository source code, structures, and README files to automatically generate a project title, descriptions, tags, highlights, and demo links.

### 4. Client-Side Image Compression
- Uses HTML5 Canvas on the frontend to automatically downscale and compress user-uploaded device images to a maximum of 1200px and 80% JPEG quality before base64 transmission, ensuring it never hits Vercel's strict **4.5MB payload size limit**.

### 5. Real-Time UI Synchronizations
- Full drag-and-drop project reordering, additions, edits, and deletions update the React state instantly upon API response, utilizing cache-busting headers to prevent Vercel CDN replica propagation lag from displaying stale data.

### 6. Seamless AJAX Form Submissions
- Message forms utilize `https://formsubmit.co/ajax/` to submit technical inquiries asynchronously, showing custom thank-you alerts without refreshing or navigating away from the page.

### 7. Multi-Theme UI Engine (37 Themes)
- Fully loaded with 32 standard DaisyUI themes plus 5 custom-designed streaming dark mode themes (`Bumblebee Dark`, `Netflix`, `HBO Max`, `Prime Video`, and `Viu`).
- Features an alphabetical header-based `ThemeDropdown` with 3-dot color swatches indicating `[Primary, Secondary, Background/Accent]` colors.
- Custom event synchronization links the top dropdown with the bottom floating Sun/Moon `ThemeToggle` dynamically.
- Dynamic text contrast mappings (e.g. `--color-muted-foreground` using `color-mix`) ensure high contrast, readability, and visual balance on any dark, light, or saturated backdrop.

---

## 🛠️ Featured Projects

### 1. SWS Skeptrons — Community Platform
> Official website of the Social Welfare Skeptrons chapter featuring member verification, anniversary countdown, and event gallery.

- 🔗 **Live:** https://sws-skeptrons.vercel.app
- 💻 **Repo:** https://github.com/ZETIC7Z/sws-website
- 🏷️ **Tech:** React, TypeScript, Tailwind CSS, Framer Motion, MongoDB, Express.js, shadcn/ui

---

### 2. Zetflix TV — Entertainment
> Entertainment hub for discovering movies, TV shows, and personalities with personalized dashboards and watchlists.

- 🔗 **Live:** https://zetflix-tv.vercel.app
- 💻 **Repo:** https://github.com/ZETIC7Z/ZETFLIX-OFFICIAL
- 🏷️ **Tech:** React, Node.js, MongoDB, Material-UI, TMDB API, Supabase, Redux

---

### 3. NEXUS — Streaming PWA
> Premium streaming platform with HD movies, TV shows, and anime featuring a Netflix-style player and full PWA support.

- 🔗 **Live:** https://www.zeticuz.online
- 💻 **Repo:** https://github.com/ZETIC7Z/NEXUS
- 🏷️ **Tech:** React, TypeScript, Tailwind CSS, Zustand, HLS.js, PWA, Vite

---

### 4. GMCS Dashboard — Enterprise Dashboard
> Interactive training compliance tracking dashboard for Accenture GMCS Philippines with analytics and theme switching.

- 🔗 **Live:** https://gmcs-dashboard.vercel.app
- 💻 **Repo:** https://github.com/ZETIC7Z/GMCS-Dashboard
- 🏷️ **Tech:** HTML, JavaScript, Node.js, Express.js, Vercel Blob, Excel Parsing

---

### 5. Dekaron Stampede — Gaming Portal
> Premium gaming portal for the Dekaron MMORPG community featuring a 14-class character gallery and cinematic effects.

- 🔗 **Live:** https://dekaron-stampede.vercel.app
- 💻 **Repo:** https://github.com/ZETIC7Z/dekaron-stampede
- 🏷️ **Tech:** React, TypeScript, Tailwind CSS, Framer Motion, Vite, Lucide React

---

## 📁 Project Structure

```
portfolio/
├── backend/                   # Serverless Backend API
│   ├── api/
│   │   ├── _cors.js           # CORS middleware
│   │   ├── login.js           # Admin token signing
│   │   ├── projects.js        # Projects CRUD API (Vercel Blob)
│   │   ├── upload.js          # Project image upload (Vercel Blob)
│   │   ├── cv.js              # Fetch resume info
│   │   ├── cv-upload.js       # Resume upload handler
│   │   ├── cv-delete.js       # Resume deletion handler
│   │   └── github-analyze.js  # AI Project Autofill API
│   ├── package.json
│   └── vercel.json
├── client/                    # Frontend React App (Vite)
│   ├── src/
│   │   ├── components/        # Sections: Hero, About, Skills, Projects, Testimonial, Contact
│   │   ├── pages/             # Pages: Home, Admin, Dashboard
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json            # Rewrite configurations
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Set up Environment Variables
Create a `.env.local` inside the `client/` folder and a `.env` in the `backend/` folder with the following keys:

```env
# Backend Env Variables (.env)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-read-write-token"
ADMIN_PASSWORD="your-secure-admin-dashboard-password"
JWT_SECRET="your-jwt-signing-secret"
OPENROUTER_API_KEY="your-openrouter-key"

# Frontend Env Variables (client/.env.local)
VITE_API_URL="http://localhost:3000"
```

### 2. Install Dependencies & Run
First, start the API backend server:
```bash
cd backend
npm install
npm run dev # or vercel dev
```

Next, run the frontend:
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 to test your dashboard and autofill locally!

---

## 🌐 Deploy to Vercel

Both `client` and `backend` directories are configured as standalone Vercel projects.

### Backend Deploy
```bash
cd backend
npx vercel link
npx vercel env add BLOB_READ_WRITE_TOKEN # add production keys
npx vercel deploy --prod
```

### Frontend Deploy
```bash
cd client
npx vercel link
npx vercel env add VITE_API_URL # set to deployed backend URL
npx vercel deploy --prod
```

---

## 📜 License

Copyright © 2026 ZETICUZ. All rights reserved.

---

**Made with ❤️ by Sam using React, Vite & Tailwind CSS**
