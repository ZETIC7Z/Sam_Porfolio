/**
 * Local dev API server for Vite proxy.
 * Routes requests to the Vercel serverless functions in api/.
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Load .env.local from parent directory (portfolio/)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx);
    let value = trimmed.slice(eqIdx + 1);
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

// Import all API handlers
const routes = {
  '/api/login': require('./api/login.cjs'),
  '/api/cv': require('./api/cv.cjs'),
  '/api/cv-upload': require('./api/cv-upload.cjs'),
  '/api/cv-delete': require('./api/cv-delete.cjs'),
  '/api/projects': require('./api/projects.cjs'),
  '/api/upload': require('./api/upload.cjs'),
  '/api/github-analyze': require('./api/github-analyze.cjs'),
};

function enhanceRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(data));
    return res;
  };
  res.send = (data) => {
    res.end(data);
    return res;
  };
  return res;
}

const server = http.createServer((req, res) => {
  enhanceRes(res);

  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const parsed = url.parse(req.url, true);
  const handler = routes[parsed.pathname];
  if (!handler) {
    res.status(404).json({ success: false, message: 'Not Found' });
    return;
  }

  // Parse JSON body
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch {
      req.body = body || {};
    }
    try {
      await handler(req, res);
    } catch (e) {
      console.error('API handler error:', e);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: e.message });
      }
    }
  });
});

const PORT = process.env.API_PORT || 3001;
server.listen(PORT, () => {
  console.log(`Local API dev server running on http://localhost:${PORT}`);
});
