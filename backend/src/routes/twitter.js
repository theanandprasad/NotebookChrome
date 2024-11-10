import express from 'express';
import { TwitterService } from '../services/twitter.js';

export const twitterRouter = express.Router();

// Request Twitter OAuth tokens
twitterRouter.get('/auth/request_token', async (req, res) => {
    try {
        const tokens = await TwitterService.getRequestToken();
        res.json(tokens);
    } catch (error) {
        console.error('Error in request_token:', error);
        res.status(500).json({ error: 'Failed to get request token' });
    }
});

// Handle Twitter OAuth callback
twitterRouter.get('/callback', async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;

    try {
        const tokens = await TwitterService.getAccessToken(oauth_token, oauth_verifier);
        
        // Send tokens back to extension
        res.send(`
            <script>
                window.opener.postMessage(${JSON.stringify(tokens)}, "${process.env.ALLOWED_ORIGINS}");
                window.close();
            </script>
        `);
    } catch (error) {
        console.error('Error in callback:', error);
        res.status(500).send('Authentication failed');
    }
}); 