export class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.displayName = data.displayName;
        this.photoURL = data.photoURL;
        this.createdAt = data.createdAt || new Date();
        this.lastLoginAt = data.lastLoginAt || new Date();
        this.twitterTokens = data.twitterTokens || null;
    }

    toFirestore() {
        return {
            email: this.email,
            displayName: this.displayName,
            photoURL: this.photoURL,
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt,
            twitterTokens: this.twitterTokens
        };
    }

    static fromFirestore(id, data) {
        return new User({
            id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            lastLoginAt: data.lastLoginAt?.toDate()
        });
    }

    isTwitterConnected() {
        return !!this.twitterTokens;
    }
} 