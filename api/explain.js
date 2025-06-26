const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing in environment variables' });
  }

  const { data, inputs } = req.body;
  const prompt = generatePrompt(data, inputs);

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    const explanation = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (explanation) {
      return res.status(200).json({ explanation });
    } else {
      return res.status(500).json({ error: 'Gemini response missing explanation', result });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Gemini API request failed', message: error.message });
  }
}

function generatePrompt(data, inputs) {
  let prompt = "Explain the following wireless communication results.\\n\\n";
  prompt += "Inputs:\\n";
  for (const [key, val] of Object.entries(inputs)) {
    prompt += `- ${key}: ${val}\\n`;
  }
  prompt += "\\nResults:\\n";
  for (const [key, val] of Object.entries(data)) {
    prompt += `- ${key}: ${val}\\n`;
  }
  return prompt;
}
