import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config({ path: new URL('../../.env', import.meta.url) });

// Log the OAuth credentials for debugging
console.log('Twitter Service Credentials:', {
    API_KEY: process.env.TWITTER_API_KEY,
    CALLBACK_URL: process.env.TWITTER_CALLBACK_URL
});

const oauth = new OAuth({
    consumer: {
        key: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_API_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64');
    }
});

export class TwitterService {
    static async getRequestToken() {
        // Log OAuth configuration
        console.log('OAuth Configuration:', {
            consumer_key: oauth.consumer.key,
            consumer_secret: oauth.consumer.secret ? '[SECRET]' : undefined
        });
        
        const request_data = {
            url: 'https://api.twitter.com/oauth/request_token',
            method: 'POST',
            data: { oauth_callback: process.env.TWITTER_CALLBACK_URL }
        };

        // Get authorization header
        const auth = oauth.authorize(request_data);
        const headers = oauth.toHeader(auth);

        try {
            console.log('Making request with:', {
                url: request_data.url,
                headers: headers,
                callback: process.env.TWITTER_CALLBACK_URL
            });

            const response = await fetch(request_data.url, {
                method: request_data.method,
                headers: {
                    ...headers,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': '*/*'
                },
                body: new URLSearchParams({
                    oauth_callback: process.env.TWITTER_CALLBACK_URL
                }).toString()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Twitter API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            console.log('Twitter API Success Response:', text);
            const parsed = new URLSearchParams(text);
            
            return {
                oauth_token: parsed.get('oauth_token'),
                oauth_token_secret: parsed.get('oauth_token_secret')
            };
        } catch (error) {
            console.error('Error getting request token:', error);
            throw error;
        }
    }

    static async getAccessToken(oauth_token, oauth_verifier) {
        const request_data = {
            url: 'https://api.twitter.com/oauth/access_token',
            method: 'POST',
            data: { 
                oauth_token,
                oauth_verifier
            }
        };

        const authorization = oauth.toHeader(oauth.authorize(request_data));

        try {
            const response = await fetch(request_data.url, {
                method: request_data.method,
                headers: {
                    ...authorization,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(request_data.data)
            });

            if (!response.ok) {
                console.error('Twitter API Response:', await response.text());
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const parsed = new URLSearchParams(text);
            
            return {
                oauth_token: parsed.get('oauth_token'),
                oauth_token_secret: parsed.get('oauth_token_secret'),
                user_id: parsed.get('user_id'),
                screen_name: parsed.get('screen_name')
            };
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    }
} 