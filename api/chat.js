const https = require('https');

module.exports = function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const { messages, model } = req.body;

  const postData = JSON.stringify({
    model: model || 'gpt-4o',
    messages: messages,
    max_tokens: 4000,
    temperature: 0.7
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const apiReq = https.request(options, function(apiRes) {
    let body = '';
    apiRes.on('data', function(chunk) { body += chunk; });
    apiRes.on('end', function() {
      try {
        const data = JSON.parse(body);
        if (apiRes.statusCode !== 200) {
          return res.status(apiRes.statusCode).json({ error: (data.error && data.error.message) || 'OpenAI API error' });
        }
        return res.status(200).json(data);
      } catch (e) {
        return res.status(500).json({ error: 'Failed to parse OpenAI response' });
      }
    });
  });

  apiReq.on('error', function(e) {
    console.error('API route error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  });

  apiReq.write(postData);
  apiReq.end();
};
