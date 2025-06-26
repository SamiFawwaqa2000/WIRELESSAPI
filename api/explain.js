// api/explain.js
const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set in environment variables.' });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const { data, inputs } = req.body;

  const prompt = generatePrompt(data, inputs);

  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    const explanation = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (explanation) {
      return res.status(200).json({ explanation });
    } else {
      return res.status(500).json({ error: 'No explanation returned', details: result });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Gemini API request failed', message: error.message });
  }
}

function generatePrompt(data, inputs) {
  let prompt = "Please explain the following wireless communication calculation results:\n\n";
  prompt += "Input Parameters:\n";
  for (const [key, value] of Object.entries(inputs)) {
    prompt += `- ${key}: ${value}\n`;
  }
  prompt += "\nResults:\n";
  for (const [key, value] of Object.entries(data)) {
    prompt += `- ${key}: ${value}\n`;
  }
  prompt += "\nPlease include in your explanation:\n";
  prompt += "1. What each result means\n";
  prompt += "2. How inputs influence the outputs\n";
  prompt += "3. Practical implications or observations\n";
  return prompt;
}
