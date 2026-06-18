const cors = require('./_cors.cjs');
const { put, list } = require('@vercel/blob');

const PROJECTS_BLOB_PATH = 'projects/projects.json';

async function getProjects() {
  const { blobs } = await list({ prefix: PROJECTS_BLOB_PATH });
  if (blobs.length === 0) return [];
  const response = await fetch(blobs[0].url);
  return response.json();
}

async function saveProjects(projects) {
  const buffer = Buffer.from(JSON.stringify(projects));
  await put(PROJECTS_BLOB_PATH, buffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  });
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;

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
