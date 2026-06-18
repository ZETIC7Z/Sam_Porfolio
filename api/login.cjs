const jwt = require('jsonwebtoken');

// Default JWT secret for local development only (Vercel should set JWT_SECRET env var)
const LOCAL_DEV_SECRET = 'portfolio-dev-secret-change-in-production';

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Check if ADMIN_PASSWORD is configured
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  // Parse request body
  const { password } = req.body || {};

  // Robust comparison (handle string/number mismatch or whitespace)
  if (String(password || '').trim() !== String(adminPassword || '').trim()) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  // Get JWT secret (fallback to local dev secret)
  const jwtSecret = process.env.JWT_SECRET || LOCAL_DEV_SECRET;

  // Sign JWT with 24 hour expiry
  const token = jwt.sign(
    { role: 'admin', iat: Date.now() },
    jwtSecret,
    { expiresIn: '24h' }
  );

  return res.status(200).json({ success: true, token });
};