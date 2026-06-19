const fs = require('fs');
const path = require('path');
const { put, list } = require('@vercel/blob');

const PROJECTS_BLOB_PATH = 'projects/projects.json';
const LOCAL_PROJECTS_PATH = path.join(__dirname, '..', 'backend', 'api', 'projects.json');

async function getProjects() {
  // Always use local file in local development
  if (fs.existsSync(LOCAL_PROJECTS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(LOCAL_PROJECTS_PATH, 'utf8'));
    } catch (e) {
      console.error('Error parsing local projects.json:', e);
    }
  }

  // Fallback to Vercel Blob if local file fails/doesn't exist
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: PROJECTS_BLOB_PATH });
      if (blobs.length > 0) {
        const response = await fetch(`${blobs[0].url}?t=${Date.now()}`);
        const text = await response.text();
        if (!text.startsWith('Your store is blocked') && !text.includes('blocked')) {
          return JSON.parse(text);
        }
      }
    } catch (error) {
      console.error('Vercel Blob getProjects error:', error);
    }
  }

  return [];
}

async function saveProjects(projects) {
  // Always write locally
  const dir = path.dirname(LOCAL_PROJECTS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LOCAL_PROJECTS_PATH, JSON.stringify(projects, null, 2), 'utf8');

  // Also write to Vercel Blob if token is available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const buffer = Buffer.from(JSON.stringify(projects));
      await put(PROJECTS_BLOB_PATH, buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
      });
    } catch (error) {
      console.error('Vercel Blob saveProjects error:', error);
    }
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const { method } = req;

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  try {
    if (method === 'GET') {
      const projects = await getProjects();
      return res.status(200).json({ success: true, projects });
    }

    if (method === 'POST') {
      const { title, categories, shortDescription, description, image, tags, demoUrl, githubUrl, featured, accentColor, status, highlights } = body || {};

      const projects = await getProjects();

      const newProject = {
        id: Date.now(),
        title,
        categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
        shortDescription: shortDescription || description || '',
        description,
        image,
        tags: tags || [],
        demoUrl,
        githubUrl,
        featured: featured || false,
        accentColor,
        status,
        highlights: highlights || [],
      };

      projects.push(newProject);
      await saveProjects(projects);

      return res.status(200).json({ success: true, project: newProject });
    }

    if (method === 'PUT') {
      const { projects } = body || {};

      if (!Array.isArray(projects)) {
        return res.status(400).json({ error: 'Projects must be an array' });
      }

      await saveProjects(projects);
      return res.status(200).json({ success: true, projects });
    }

    if (method === 'DELETE') {
      const { id } = body || {};

      if (!id) {
        return res.status(400).json({ error: 'Missing project id' });
      }

      const projects = await getProjects();
      const filtered = projects.filter((p) => p.id !== id);
      await saveProjects(filtered);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Projects API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};