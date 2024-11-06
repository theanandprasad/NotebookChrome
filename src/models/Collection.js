export class Collection {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.userId = data.userId;
        this.tweetCount = data.tweetCount || 0;
    }

    toFirestore() {
        return {
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            userId: this.userId,
            tweetCount: this.tweetCount
        };
    }

    static fromFirestore(id, data) {
        return new Collection({
            id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
        });
    }
} 