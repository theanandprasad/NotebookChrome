export class Tweet {
    constructor(data) {
        this.id = data.id;                     // Tweet ID from Twitter
        this.content = data.content;           // Tweet text
        this.authorId = data.authorId;         // Twitter user ID
        this.authorUsername = data.authorUsername;
        this.authorName = data.authorName;
        this.createdAt = data.createdAt || new Date();
        this.savedAt = data.savedAt || new Date();
        this.mediaUrls = data.mediaUrls || [];
        this.isThread = data.isThread || false;
        this.threadIds = data.threadIds || [];  // Array of tweet IDs in the thread
        this.collections = data.collections || []; // Array of collection IDs this tweet belongs to
    }

    toFirestore() {
        return {
            id: this.id,
            content: this.content,
            authorId: this.authorId,
            authorUsername: this.authorUsername,
            authorName: this.authorName,
            createdAt: this.createdAt,
            savedAt: this.savedAt,
            mediaUrls: this.mediaUrls,
            isThread: this.isThread,
            threadIds: this.threadIds,
            collections: this.collections
        };
    }

    static fromFirestore(id, data) {
        return new Tweet({
            id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            savedAt: data.savedAt?.toDate()
        });
    }
} 