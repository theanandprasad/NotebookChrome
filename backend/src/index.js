import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the path to .env file (one level up from src/index.js to backend/.env)
const envPath = path.join(__dirname, '..', '.env');

// Log the path and attempt to load .env
console.log('Looking for .env file at:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error.message);
} else {
    console.log('.env file loaded successfully');
}

// Log environment variables to verify they're loaded
console.log('Environment variables:', {
    PORT: process.env.PORT,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET ? '[SECRET]' : undefined,
    TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
});

import express from 'express';
import cors from 'cors';
import { twitterRouter } from './routes/twitter.js';

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/twitter', twitterRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 