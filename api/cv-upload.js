const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { filename, data } = req.body || {};

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
        pathname: blob.pathname
      }
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};