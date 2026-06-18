const cors = require('./_cors.cjs');
const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { filename, data } = body || {};

    if (!filename || !data) {
      return res.status(400).json({ success: false, message: 'Missing filename or data' });
    }

    const base64Data = data.includes(',') ? data.split(',')[1] : data;
    const buffer = Buffer.from(base64Data, 'base64');
    const pathname = `cv/${filename}`;

    const blob = await put(pathname, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });

    return res.status(200).json({
      success: true,
      cv: {
        url: blob.url,
        pathname: blob.pathname,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
