const cors = require('./_cors.js');
const fs = require('fs');
const path = require('path');
const { del } = require('@vercel/blob');

const LOCAL_CV_PATH = path.join(__dirname, 'cv.json');

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { pathname } = req.body || {};

    if (!pathname) {
      return res.status(400).json({ success: false, message: 'Missing pathname' });
    }

    // In local development, delete the local file and clear metadata
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      const filename = path.basename(pathname);
      let cvDir = path.join(process.cwd(), 'client', 'public', 'cv');
      if (!fs.existsSync(cvDir) && fs.existsSync(path.join(process.cwd(), '..', 'client'))) {
        cvDir = path.join(process.cwd(), '..', 'client', 'public', 'cv');
      }
      
      const filePath = path.join(cvDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Error deleting local CV file:', e);
        }
      }

      // Reset cv.json to null
      try {
        fs.writeFileSync(LOCAL_CV_PATH, 'null', 'utf8');
      } catch (e) {
        console.error('Error writing cv.json:', e);
      }

      console.log(`Deleted local CV: ${filePath}`);
      return res.status(200).json({ success: true });
    }

    // Otherwise, try Vercel Blob
    await del([pathname], { token: process.env.BLOB_READ_WRITE_TOKEN });

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
