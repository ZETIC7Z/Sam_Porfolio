const cors = require('./_cors.js');
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
    return res.status(500).json({ error: 'Internal server error' });
  }
};
