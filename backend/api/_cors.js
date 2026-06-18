/**
 * CORS helper - handles preflight and sets headers.
 * Files starting with _ are NOT treated as API routes by Vercel.
 * @returns {boolean} true if OPTIONS was handled (caller should return early)
 */
module.exports = function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
};
