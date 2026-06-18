const cors = require('./_cors.cjs');
const { del } = require('@vercel/blob');

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { pathname } = body || {};

    if (!pathname) {
      return res.status(400).json({ success: false, message: 'Missing pathname' });
    }

    await del([pathname], { token: process.env.BLOB_READ_WRITE_TOKEN });

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
