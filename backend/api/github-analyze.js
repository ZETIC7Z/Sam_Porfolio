const cors = require('./_cors.js');

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { githubUrl } = body || {};
    if (!githubUrl) return res.status(400).json({ error: 'Missing githubUrl' });

    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\s?#]+)/);
    if (!match) return res.status(400).json({ error: 'Invalid GitHub URL' });
    const owner = match[1];
    const repo = match[2].replace(/\/$/, '');

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoRes.ok) throw new Error('Repo not found');
    const repoData = await repoRes.json();

    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
    let readmeText = '';
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeText = Buffer.from(readmeData.content, 'base64').toString('utf-8');
    }

    let demoUrl = repoData.homepage || '';
    if (!demoUrl && readmeText) {
      const patterns = [
        /live\s*(?:demo|site|url)\s*[:\-]?\s*(https?:\/\/[^\s\n\r\"<>\)]+)/i,
        /demo\s*[:\-]?\s*(https?:\/\/[^\s\n\r\"<>\)]+)/i,
        /deployed\s*(?:at|on|to)\s*[:\-]?\s*(https?:\/\/[^\s\n\r\"<>\)]+)/i,
        /see\s*it\s*live\s*[:\-]?\s*(https?:\/\/[^\s\n\r\"<>\)]+)/i,
      ];
      for (const p of patterns) {
        const m = readmeText.match(p);
        if (m) { demoUrl = m[1]; break; }
      }
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    let description = '';
    let category = [];
    let tags = [];
    let highlights = [];

    try {
      const AVAILABLE_CATEGORIES = [
        'Community Platforms', 'Corporate & Agency', 'Directories & Listings',
        'Documentation & Wikis', 'E-Commerce Stores', 'E-Learning & Courses',
        'Enterprise Dashboards', 'Events & Meetups', 'Forums & Niche Clubs',
        'Gaming & eSports', 'Music & Audio', 'News & Publishing',
        'Non-Profit & Welfare', 'Progressive Web Apps (PWA)', 'Real Estate & Property',
        'SaaS & Software', 'Single Page Applications (SPA)', 'Static Sites & Landing Pages',
        'Video & Streaming', 'Visual Arts & Design',
      ];

      const aiBody = {
        messages: [
          { role: 'system', content: `You are a JSON generator. Given a GitHub repo README and metadata, return ONLY valid JSON with no markdown formatting.\n\nAvailable categories (pick 1-3): ${AVAILABLE_CATEGORIES.join(', ')}.\n\nKeys: shortDescription (string, max 135 chars, concise card summary), description (string, 2-3 sentences, longer detail view), categories (array of 1-3 strings from the available categories list), tags (array of 5-8 tech stack strings), highlights (array of 3 feature strings).` },
          { role: 'user', content: `Repo: ${repoData.full_name}\nDescription: ${repoData.description || 'N/A'}\nTopics: ${(repoData.topics || []).join(', ')}\nREADME excerpt:\n${readmeText.slice(0, 2000)}` }
        ],
        seed: 42,
        model: 'openai',
      };

      let aiText = '';

      if (openRouterKey) {
        try {
          const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'https://zeticuz.xyz',
              'X-Title': 'Portfolio Dashboard',
            },
            body: JSON.stringify({
              messages: aiBody.messages,
              model: 'openrouter/free',
              temperature: 0.7,
            }),
          });
          if (aiRes.ok) {
            const aiData = await aiRes.json();
            aiText = aiData.choices?.[0]?.message?.content || '';
          }
        } catch (err) {
          console.error('OpenRouter failed:', err.message);
        }
      }

      if (!aiText) {
        try {
          const pollRes = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aiBody),
          });
          if (pollRes.ok) {
            aiText = await pollRes.text();
          }
        } catch (err) {
          console.error('Pollinations failed:', err.message);
        }
      }

      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.shortDescription) description = parsed.shortDescription;
        else if (parsed.description) description = parsed.description;
        if (parsed.highlights) highlights = parsed.highlights;
        if (parsed.categories) category = parsed.categories;
        else if (parsed.category) category = [parsed.category];
        if (parsed.tags) tags = parsed.tags;
      }
    } catch (e) {
      console.error('AI generation error:', e.message);
    }

    return res.status(200).json({
      success: true,
      data: {
        title: repoData.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        categories: Array.isArray(category) ? category.slice(0, 3) : (category ? [category] : []),
        shortDescription: description,
        description,
        tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
        highlights: Array.isArray(highlights) ? highlights.slice(0, 5) : [],
        demoUrl,
        githubUrl,
        accentColor: 'from-cyan-500 to-blue-600',
        status: 'Live',
      }
    });
  } catch (e) {
    console.error('github-analyze error:', e);
    return res.status(500).json({ success: false, error: e.message });
  }
};
