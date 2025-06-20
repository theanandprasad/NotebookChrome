console.log('Content script loaded - NotebookChrome');

// Constants for Twitter selectors
const SELECTORS = {
    TWEET: 'article[data-testid="tweet"]',
    TWEET_TEXT: '[data-testid="tweetText"]',
    TWEET_AUTHOR: '[data-testid="User-Name"]',
    TWEET_MEDIA: '[data-testid="tweetPhoto"], [data-testid="tweetVideo"]',
    TWEET_THREAD: '[data-testid="conversationThread"]',
    TWEET_ACTIONS: '[role="group"]'
};

class TweetSaver {
    constructor() {
        console.log('TweetSaver initialized');
        this.init();
    }

    init() {
        // Wait for tweets to load
        setTimeout(() => {
            console.log('Looking for tweets...');
            const tweets = document.querySelectorAll(SELECTORS.TWEET);
            console.log(`Found ${tweets.length} tweets`);
            this.addSaveButtonsToTweets();
        }, 2000);

        // Watch for new tweets being added
        this.observeNewTweets();
    }

    addSaveButtonsToTweets() {
        document.querySelectorAll(SELECTORS.TWEET).forEach(tweet => {
            if (!tweet.querySelector('.notebook-save-btn')) {
                console.log('Adding save button to tweet:', tweet);
                this.addSaveButton(tweet);
            }
        });
    }

    addSaveButton(tweetElement) {
        const actionsBar = tweetElement.querySelector(SELECTORS.TWEET_ACTIONS);
        if (!actionsBar) {
            console.log('No actions bar found for tweet:', tweetElement);
            return;
        }

        console.log('Found actions bar:', actionsBar);

        const saveButton = document.createElement('div');
        saveButton.className = 'notebook-save-btn';
        saveButton.innerHTML = `
            <div role="button" tabindex="0" style="cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" 
                          class="notebook-save-icon"
                          stroke="currentColor"
                          fill="none"
                          stroke-width="2"/>
                </svg>
            </div>
        `;

        saveButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSaveTweet(tweetElement);
        });

        actionsBar.appendChild(saveButton);
        console.log('Save button added:', saveButton);
    }

    async handleSaveTweet(tweetElement) {
        try {
            const tweetData = this.extractTweetData(tweetElement);
            
            // Send message to background script to save tweet
            chrome.runtime.sendMessage({
                type: 'SAVE_TWEET',
                tweet: tweetData
            }, response => {
                if (response.success) {
                    this.showSaveSuccess(tweetElement);
                } else {
                    this.showSaveError(tweetElement);
                }
            });
        } catch (error) {
            console.error('Error saving tweet:', error);
            this.showSaveError(tweetElement);
        }
    }

    extractTweetData(tweetElement) {
        // Get tweet ID from the link to the tweet
        const tweetLink = tweetElement.querySelector('a[href*="/status/"]');
        const tweetId = tweetLink?.href.match(/\/status\/(\d+)/)?.[1];

        // Get tweet text
        const tweetText = tweetElement.querySelector(SELECTORS.TWEET_TEXT)?.textContent;

        // Get author info
        const authorElement = tweetElement.querySelector(SELECTORS.TWEET_AUTHOR);
        const authorName = authorElement?.querySelector('span')?.textContent;
        const authorUsername = authorElement?.querySelector('span:last-child')?.textContent.replace('@', '');

        // Get media URLs
        const mediaElements = tweetElement.querySelectorAll(SELECTORS.TWEET_MEDIA);
        const mediaUrls = Array.from(mediaElements).map(media => {
            return media.querySelector('img')?.src || media.querySelector('video')?.src;
        }).filter(Boolean);

        // Check if it's part of a thread
        const isThread = !!tweetElement.closest(SELECTORS.TWEET_THREAD);

        return {
            id: tweetId,
            content: tweetText,
            authorName,
            authorUsername,
            mediaUrls,
            isThread,
            createdAt: new Date()
        };
    }

    showSaveSuccess(tweetElement) {
        const saveBtn = tweetElement.querySelector('.notebook-save-btn');
        if (saveBtn) {
            saveBtn.querySelector('.notebook-save-icon').style.fill = '#1DA1F2';
            setTimeout(() => {
                saveBtn.querySelector('.notebook-save-icon').style.fill = 'none';
            }, 2000);
        }
    }

    showSaveError(tweetElement) {
        const saveBtn = tweetElement.querySelector('.notebook-save-btn');
        if (saveBtn) {
            saveBtn.querySelector('.notebook-save-icon').style.stroke = '#f4212e';
            setTimeout(() => {
                saveBtn.querySelector('.notebook-save-icon').style.stroke = 'currentColor';
            }, 2000);
        }
    }

    observeNewTweets() {
        console.log('Setting up tweet observer');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const tweets = node.querySelectorAll(SELECTORS.TWEET);
                        if (tweets.length > 0) {
                            console.log(`Found ${tweets.length} new tweets`);
                            tweets.forEach(tweet => {
                                if (!tweet.querySelector('.notebook-save-btn')) {
                                    this.addSaveButton(tweet);
                                }
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize the tweet saver
console.log('Starting TweetSaver...');
new TweetSaver();