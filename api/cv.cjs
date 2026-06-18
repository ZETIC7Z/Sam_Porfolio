const { list } = require('@vercel/blob');

module.exports = async (req, res) => {
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