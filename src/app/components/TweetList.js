export class TweetList {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.tweets = [];
    }

    setTweets(tweets) {
        this.tweets = tweets;
        this.render();
    }

    render() {
        if (this.tweets.length === 0) {
            this.containerElement.innerHTML = `
                <div class="empty-state">
                    <p>No saved tweets yet. Click the save button on any tweet to get started!</p>
                </div>
            `;
            return;
        }

        this.containerElement.innerHTML = `
            <div class="tweet-list">
                ${this.tweets.map(tweet => this.renderTweet(tweet)).join('')}
            </div>
        `;

        // Add event listeners after rendering
        this.addEventListeners();
    }

    renderTweet(tweet) {
        return `
            <div class="tweet-card" data-tweet-id="${tweet.id}">
                <div class="tweet-header">
                    <div class="tweet-author">
                        <span class="author-name">${tweet.authorName}</span>
                        <span class="author-username">@${tweet.authorUsername}</span>
                    </div>
                    <div class="tweet-actions">
                        <button class="btn-collection" title="Add to collection">
                            <i class="fas fa-folder-plus"></i>
                        </button>
                        <button class="btn-delete" title="Delete tweet">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="tweet-content">${tweet.content}</div>
                ${tweet.mediaUrls.length > 0 ? this.renderMedia(tweet.mediaUrls) : ''}
                <div class="tweet-footer">
                    <span class="tweet-date">Saved on ${new Date(tweet.savedAt).toLocaleDateString()}</span>
                    ${tweet.isThread ? '<span class="thread-badge">Thread</span>' : ''}
                </div>
            </div>
        `;
    }

    renderMedia(mediaUrls) {
        return `
            <div class="tweet-media">
                ${mediaUrls.map(url => `
                    <div class="media-item">
                        <img src="${url}" alt="Tweet media" loading="lazy">
                    </div>
                `).join('')}
            </div>
        `;
    }

    addEventListeners() {
        // Delete buttons
        this.containerElement.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const tweetCard = e.target.closest('.tweet-card');
                const tweetId = tweetCard.dataset.tweetId;
                this.handleDelete(tweetId);
            });
        });

        // Collection buttons
        this.containerElement.querySelectorAll('.btn-collection').forEach(button => {
            button.addEventListener('click', (e) => {
                const tweetCard = e.target.closest('.tweet-card');
                const tweetId = tweetCard.dataset.tweetId;
                this.handleAddToCollection(tweetId);
            });
        });
    }

    async handleDelete(tweetId) {
        if (confirm('Are you sure you want to delete this tweet?')) {
            try {
                await this.onDeleteTweet(tweetId);
                this.tweets = this.tweets.filter(t => t.id !== tweetId);
                this.render();
            } catch (error) {
                console.error('Error deleting tweet:', error);
            }
        }
    }

    handleAddToCollection(tweetId) {
        // This will be implemented when we create the collection modal
        console.log('Add to collection:', tweetId);
    }

    setOnDeleteTweet(callback) {
        this.onDeleteTweet = callback;
    }
} 