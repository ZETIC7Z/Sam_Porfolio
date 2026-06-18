const cors = require('./_cors.js');
const jwt = require('jsonwebtoken');

const LOCAL_DEV_SECRET = 'portfolio-dev-secret-change-in-production';

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { password } = body || {};

  if (password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const jwtSecret = process.env.JWT_SECRET || LOCAL_DEV_SECRET;

  const token = jwt.sign(
    { role: 'admin', iat: Date.now() },
    jwtSecret,
    { expiresIn: '24h' }
  );

  return res.status(200).json({ success: true, token });
};
