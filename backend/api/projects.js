const cors = require('./_cors.js');
const fs = require('fs');
const path = require('path');
const { put, list } = require('@vercel/blob');

const PROJECTS_BLOB_PATH = 'projects/projects.json';
const LOCAL_PROJECTS_PATH = path.join(__dirname, 'projects.json');

async function getProjects() {
  // Try Vercel Blob first in production
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: PROJECTS_BLOB_PATH });
      if (blobs.length > 0) {
        // Bypass Vercel Blob CDN caching by appending a unique timestamp
        const response = await fetch(`${blobs[0].url}?t=${Date.now()}`);
        const text = await response.text();
        if (!text.startsWith('Your store is blocked') && !text.includes('blocked')) {
          return JSON.parse(text);
        }
      }
    } catch (error) {
      console.error('Vercel Blob getProjects error, falling back to local projects.json:', error);
    }
  }

  // Fallback to local projects.json file compiled into Vercel deployment
  if (fs.existsSync(LOCAL_PROJECTS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(LOCAL_PROJECTS_PATH, 'utf8'));
    } catch (e) {
      console.error('Error parsing local projects.json:', e);
    }
  }

  return [];
}

async function saveProjects(projects) {
  // Always try to write locally (in case we are running locally with this handler)
  try {
    fs.writeFileSync(LOCAL_PROJECTS_PATH, JSON.stringify(projects, null, 2), 'utf8');
  } catch (e) {
    // Expected on read-only serverless environment, ignore
  }

  // Write to Vercel Blob in production
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const buffer = Buffer.from(JSON.stringify(projects));
    await put(PROJECTS_BLOB_PATH, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });
  }
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  // Prevent caching of projects list in browser and CDN
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

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
