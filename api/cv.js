const { list } = require('@vercel/blob');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: 'cv/' });

    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ success: false, message: 'No CV found' });
    }

    const cv = blobs[0];
    return res.status(200).json({
      success: true,
      cv: {
        url: cv.url,
        pathname: cv.pathname,
        uploadedAt: cv.uploadedAt
      }
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};