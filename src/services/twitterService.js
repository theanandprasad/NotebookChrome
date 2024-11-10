import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const BACKEND_URL = 'http://localhost:3000'; // We'll move this to config later

export const twitterService = {
    async connectTwitter(userId, twitterTokens) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            twitterTokens: {
                oauth_token: twitterTokens.oauth_token,
                oauth_token_secret: twitterTokens.oauth_token_secret,
                screen_name: twitterTokens.screen_name,
                user_id: twitterTokens.user_id,
                connectedAt: new Date()
            }
        });
    },

    async getTwitterTokens(userId) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data().twitterTokens;
        }
        return null;
    },

    async disconnectTwitter(userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            twitterTokens: null
        });
    },

    async initializeTwitterAuth() {
        try {
            // Get request token from backend
            const response = await fetch(`${BACKEND_URL}/twitter/auth/request_token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to initialize Twitter auth');
            }

            const { oauth_token } = await response.json();

            // Open Twitter authorization page in a popup
            return new Promise((resolve, reject) => {
                const width = 600;
                const height = 600;
                const left = (screen.width / 2) - (width / 2);
                const top = (screen.height / 2) - (height / 2);

                const authWindow = window.open(
                    `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}`,
                    'Twitter Authorization',
                    `width=${width},height=${height},left=${left},top=${top}`
                );

                // Listen for the callback message
                window.addEventListener('message', async function handleCallback(event) {
                    if (event.origin !== BACKEND_URL) return;

                    try {
                        const data = event.data;
                        if (data.oauth_token && data.oauth_token_secret) {
                            window.removeEventListener('message', handleCallback);
                            authWindow.close();
                            resolve(data);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Error in Twitter auth:', error);
            throw error;
        }
    }
}; 