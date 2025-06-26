require('dotenv').config();
const express = require('express');
const path = require('path');
const explainRouter = require('./api/explain');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api', explainRouter);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    if (!process.env.OPENAI_API_KEY) {
        console.warn('Warning: OPENAI_API_KEY is not set in environment variables');
    }
}); 
