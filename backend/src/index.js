import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { twitterRouter } from './routes/twitter.js';

dotenv.config();

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