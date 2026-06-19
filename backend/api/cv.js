const cors = require('./_cors.js');
const fs = require('fs');
const path = require('path');
const { list } = require('@vercel/blob');

const LOCAL_CV_PATH = path.join(__dirname, 'cv.json');

async function getCv() {
  // Try Vercel Blob first in production
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'cv/' });
      if (blobs && blobs.length > 0) {
        return {
          url: blobs[0].url,
          pathname: blobs[0].pathname,
          uploadedAt: blobs[0].uploadedAt
        };
      }
    } catch (error) {
      console.error('Vercel Blob getCv error, falling back to local cv.json:', error);
    }
  }

  // Fallback to local cv.json file
  if (fs.existsSync(LOCAL_CV_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(LOCAL_CV_PATH, 'utf8'));
      if (data) return data;
    } catch (e) {
      console.error('Error parsing local cv.json:', e);
    }
  }

  return null;
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const cv = await getCv();
    if (!cv) {
      return res.status(404).json({ success: false, message: 'No CV found' });
    }
    return res.status(200).json({ success: true, cv });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
