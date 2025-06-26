require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post('/explain', async (req, res) => {
    try {
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

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        if (result && result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
            res.json({ explanation: result.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: 'Failed to generate explanation from Gemini API', details: result });
        }
    } catch (error) {
        console.error('Error generating explanation:', error);
        res.status(500).json({ error: 'Failed to generate explanation', details: error.message });
    }
});

function generatePrompt(data, inputs) {
    let prompt = "Please explain the following wireless communication calculation results:\n\n";
    prompt += "Input Parameters:\n";
    for (const [key, value] of Object.entries(inputs)) {
        prompt += `${key}: ${value}\n`;
    }
    prompt += "\nResults:\n";
    for (const [key, value] of Object.entries(data)) {
        prompt += `${key}: ${value}\n`;
    }
    prompt += "\nPlease provide a detailed explanation of these results, including:\n";
    prompt += "1. What each result means in the context of wireless communications\n";
    prompt += "2. The relationships between the input parameters and results\n";
    prompt += "3. Any important implications or considerations\n";
    prompt += "4. How these results might be used in practical applications";
    return prompt;
}

module.exports = router;