import { auth } from '../config/firebase.js';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { userService } from '../services/userService';
import { tweetService } from '../services/tweetService';
import { collectionService } from '../services/collectionService';
import { TweetList } from './components/TweetList';
import { CollectionList } from './components/CollectionList';

let tweetList;
let collectionList;
let currentView = 'home';

document.addEventListener('DOMContentLoaded', () => {
    initializeComponents();
    initializeAuth();
    initializeNavigation();
});

function initializeComponents() {
    const contentSection = document.getElementById('content-section');
    tweetList = new TweetList(contentSection);
    collectionList = new CollectionList(contentSection);

    // Set up callbacks
    tweetList.setOnDeleteTweet(async (tweetId) => {
        const user = auth.currentUser;
        if (user) {
            await tweetService.deleteTweet(user.uid, tweetId);
        }
    });

    collectionList.setOnDeleteCollection(async (collectionId) => {
        const user = auth.currentUser;
        if (user) {
            await collectionService.deleteCollection(user.uid, collectionId);
        }
    });

    // Set up collection callbacks
    collectionList.setOnCreateCollection(async (formData) => {
        const user = auth.currentUser;
        if (user) {
            return await collectionService.createCollection(user.uid, formData);
        }
    });

    collectionList.setOnUpdateCollection(async (collectionId, formData) => {
        const user = auth.currentUser;
        if (user) {
            return await collectionService.updateCollection(user.uid, collectionId, formData);
        }
    });

    collectionList.setOnGetCollections(async () => {
        const user = auth.currentUser;
        if (user) {
            return await collectionService.getUserCollections(user.uid);
        }
        return [];
    });
}

async function initializeAuth() {
    const signInButton = document.getElementById('signin-button');
    const authSection = document.getElementById('auth-section');
    const contentSection = document.getElementById('content-section');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const existingUser = await userService.getUser(user.uid);
                if (!existingUser) {
                    await userService.createUser({
                        id: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    });
                } else {
                    await userService.updateLastLogin(user.uid);
                }
                
                // Update UI with user info
                const userInfo = document.getElementById('user-info');
                const userAvatar = userInfo.querySelector('.user-avatar');
                const userName = userInfo.querySelector('.user-name');
                const userEmail = userInfo.querySelector('.user-email');
                
                userAvatar.src = user.photoURL || 'icons/default-avatar.png';
                userName.textContent = user.displayName;
                userEmail.textContent = user.email;
                
                // Show user info and logout button
                userInfo.classList.remove('hidden');
                document.getElementById('logout-button').classList.remove('hidden');
                
                // Hide auth section and show content
                document.getElementById('auth-section').classList.add('hidden');
                document.getElementById('content-section').classList.remove('hidden');
                
                await loadUserData(user.uid);
            } catch (error) {
                console.error('Error setting up user:', error);
            }
        } else {
            // Hide user info and logout button
            document.getElementById('user-info').classList.add('hidden');
            document.getElementById('logout-button').classList.add('hidden');
            
            // Show auth section and hide content
            document.getElementById('auth-section').classList.remove('hidden');
            document.getElementById('content-section').classList.add('hidden');
        }
    });

    signInButton.addEventListener('click', async () => {
        try {
            const token = await new Promise((resolve, reject) => {
                chrome.identity.getAuthToken({ interactive: true }, (token) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(token);
                    }
                });
            });

            const credential = GoogleAuthProvider.credential(null, token);
            
            await signInWithCredential(auth, credential);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    });

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', async () => {
        try {
            // Sign out from Firebase
            await auth.signOut();
            
            // Remove the cached token
            chrome.identity.getAuthToken({ interactive: false }, function(token) {
                if (token) {
                    // Remove token from Chrome's cache
                    chrome.identity.removeCachedAuthToken({ token: token }, function() {
                        // Revoke token
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + token);
                        xhr.send();
                    });
                }
            });

            // Clear any local storage if you're using it
            localStorage.clear();
            
            console.log('Successfully signed out');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.textContent.toLowerCase();
            switchView(view);
        });
    });
}

async function switchView(view) {
    currentView = view;
    const contentHeader = document.querySelector('.content-header h2');
    const contentSection = document.getElementById('content-section');

    switch (view) {
        case 'home':
        case 'saved tweets':
            contentHeader.textContent = 'My Saved Tweets';
            const tweets = await tweetService.getUserTweets(auth.currentUser.uid);
            tweetList.setTweets(tweets);
            break;
        case 'collections':
            contentHeader.textContent = 'My Collections';
            const collections = await collectionService.getUserCollections(auth.currentUser.uid);
            collectionList.setCollections(collections);
            break;
        case 'settings':
            contentHeader.textContent = 'Settings';
            contentSection.innerHTML = '<div class="settings-page">Settings page coming soon...</div>';
            break;
    }
}

async function loadUserData(userId) {
    try {
        // Load initial data based on current view
        switchView(currentView);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
} 