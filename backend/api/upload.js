const cors = require('./_cors.js');
const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { filename, data, prefix } = body || {};

    if (!filename || !data) {
      return res.status(400).json({ error: 'Missing required fields: filename and data' });
    }

    const base64Data = data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // In local development, save directly to the local client/public/ folder
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      if (prefix && prefix.startsWith('cv')) {
        let cvDir = path.join(process.cwd(), 'client', 'public', 'cv');
        if (!fs.existsSync(cvDir) && fs.existsSync(path.join(process.cwd(), '..', 'client'))) {
          cvDir = path.join(process.cwd(), '..', 'client', 'public', 'cv');
        }
        
        let dirExists = fs.existsSync(cvDir);
        if (!dirExists) {
          try {
            fs.mkdirSync(cvDir, { recursive: true });
            dirExists = true;
          } catch (e) {}
        }

        if (dirExists) {
          const filePath = path.join(cvDir, filename);
          fs.writeFileSync(filePath, buffer);

          // Update cv.json metadata
          const cvMetadata = {
            url: `/cv/${filename}`,
            pathname: `cv/${filename}`,
            uploadedAt: new Date().toISOString()
          };
          
          let cvJsonPath = path.join(process.cwd(), 'backend', 'api', 'cv.json');
          if (!fs.existsSync(path.dirname(cvJsonPath)) && fs.existsSync(path.join(process.cwd(), '..', 'backend'))) {
            cvJsonPath = path.join(process.cwd(), '..', 'backend', 'api', 'cv.json');
          }
          
          try {
            fs.writeFileSync(cvJsonPath, JSON.stringify(cvMetadata, null, 2), 'utf8');
          } catch (e) {
            console.error('Error writing cv.json:', e);
          }

          console.log(`Saved CV locally: ${filePath}`);
          return res.status(200).json({
            success: true,
            file: cvMetadata
          });
        }
      } else {
        let projectsDir = path.join(process.cwd(), 'client', 'public', 'projects');
        if (!fs.existsSync(projectsDir) && fs.existsSync(path.join(process.cwd(), '..', 'client'))) {
          projectsDir = path.join(process.cwd(), '..', 'client', 'public', 'projects');
        }
        
        let dirExists = fs.existsSync(projectsDir);
        if (!dirExists) {
          try {
            fs.mkdirSync(projectsDir, { recursive: true });
            dirExists = true;
          } catch (e) {}
        }

        if (dirExists) {
          const filePath = path.join(projectsDir, filename);
          fs.writeFileSync(filePath, buffer);
          console.log(`Saved project image locally: ${filePath}`);
          return res.status(200).json({
            success: true,
            file: {
              url: `/projects/${filename}`,
              pathname: `projects/${filename}`,
            },
          });
        }
      }
    }

    // In production (Vercel), try Vercel Blob
    const pathname = prefix ? `${prefix}${filename}` : filename;

    const blob = await put(pathname, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });

    return res.status(200).json({
      success: true,
      file: {
        url: blob.url,
        pathname: blob.pathname,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(403).json({ error: 'Live upload is disabled because the Vercel Blob store is blocked. Please run the project locally to manage projects and upload images, then push to GitHub.' });
  }
};
