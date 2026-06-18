const fs = require('fs');
const path = require('path');

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!BLOB_TOKEN) { console.error('Missing BLOB_READ_WRITE_TOKEN'); process.exit(1); }

const { put } = require('/home/zeticuz/Music/portfolio/client/node_modules/@vercel/blob');

const PROJECTS_FILE = 'projects/projects.json';

const DEFAULT_PROJECTS = [
  {
    id: 1, title: "SWS Skeptrons", category: "Community Platform",
    description: "Official website of the Social Welfare Skeptrons chapter featuring member verification, anniversary countdown, and event gallery.",
    image: "/projects/project9.png",
    tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "MongoDB", "Express.js", "shadcn/ui"],
    demoUrl: "https://sws-skeptrons.vercel.app", githubUrl: "https://github.com/ZETIC7Z/sws-website",
    featured: true, accentColor: "from-cyan-500 to-blue-600", status: "Live",
    highlights: ["Member verification", "Anniversary countdown", "Event gallery"]
  },
  {
    id: 2, title: "Zetflix TV", category: "Entertainment",
    description: "Entertainment hub for discovering movies, TV shows, and personalities with personalized dashboards and watchlists.",
    image: "/projects/project10.png",
    tags: ["React", "Node.js", "MongoDB", "Material-UI", "TMDB API", "Supabase", "Redux"],
    demoUrl: "https://zetflix-tv.vercel.app", githubUrl: "https://github.com/ZETIC7Z/ZETFLIX-OFFICIAL",
    featured: true, accentColor: "from-red-500 to-rose-600", status: "Live",
    highlights: ["Personalized dashboard", "Watchlist management", "TMDB integration"]
  },
  {
    id: 3, title: "NEXUS", category: "Streaming PWA",
    description: "Premium streaming platform with HD movies, TV shows, and anime featuring a Netflix-style player and PWA support.",
    image: "/projects/project11.png",
    tags: ["React", "TypeScript", "Tailwind CSS", "Zustand", "HLS.js", "PWA", "Vite"],
    demoUrl: "https://www.zeticuz.online", githubUrl: "https://github.com/ZETIC7Z/NEXUS",
    featured: true, accentColor: "from-fuchsia-500 to-purple-600", status: "Live",
    highlights: ["Netflix-style player", "PWA support", "Multi-source streaming"]
  },
  {
    id: 4, title: "GMCS Dashboard", category: "Enterprise Dashboard",
    description: "Interactive training compliance tracking dashboard for Accenture GMCS Philippines with analytics and theme switching.",
    image: "/projects/project12.png",
    tags: ["HTML", "JavaScript", "Node.js", "Express.js", "Vercel Blob", "Excel Parsing"],
    demoUrl: "https://gmcs-dashboard.vercel.app", githubUrl: "https://github.com/ZETIC7Z/GMCS-Dashboard",
    featured: true, accentColor: "from-slate-500 to-gray-600", status: "Live",
    highlights: ["Compliance tracking", "Geolocation analytics", "Theme switching"]
  },
  {
    id: 5, title: "Dekaron Stampede", category: "Gaming Portal",
    description: "Premium gaming portal for the Dekaron MMORPG community featuring a 14-class character gallery and cinematic effects.",
    image: "/projects/project13.png",
    tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Lucide React"],
    demoUrl: "https://dekaron-stampede.vercel.app", githubUrl: "https://github.com/ZETIC7Z/dekaron-stampede",
    featured: true, accentColor: "from-lime-500 to-green-600", status: "Live",
    highlights: ["14-class gallery", "Cinematic effects", "Responsive design"]
  }
];

async function uploadImage(imagePath, filename) {
  const fullPath = path.join('/home/zeticuz/Music/portfolio/client/public', imagePath);
  if (!fs.existsSync(fullPath)) { console.warn(`Image not found: ${fullPath}`); return null; }
  const buffer = fs.readFileSync(fullPath);
  const blob = await put(`projects/images/${filename}`, buffer, { access: 'public', token: BLOB_TOKEN, allowOverwrite: true });
  console.log(`Uploaded ${filename} → ${blob.url}`);
  return blob.url;
}

async function seed() {
  const projects = [];
  for (const p of DEFAULT_PROJECTS) {
    const filename = p.image.split('/').pop();
    const blobUrl = await uploadImage(p.image, filename);
    projects.push({ ...p, image: blobUrl || p.image });
  }

  const buffer = Buffer.from(JSON.stringify(projects));
  await put(PROJECTS_FILE, buffer, { access: 'public', token: BLOB_TOKEN, allowOverwrite: true });
  console.log(`Seeded ${projects.length} projects to ${PROJECTS_FILE}`);
  for (const p of projects) { console.log(`  - ${p.title}: ${p.image}`); }
}

seed().catch(console.error);
