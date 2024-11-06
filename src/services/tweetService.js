import { 
    collection, doc, setDoc, getDoc, getDocs, 
    query, where, orderBy, deleteDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Tweet } from '../models/Tweet';

export const tweetService = {
    async saveTweet(userId, tweetData) {
        const tweet = new Tweet(tweetData);
        const tweetRef = doc(db, `users/${userId}/savedTweets/${tweet.id}`);
        await setDoc(tweetRef, tweet.toFirestore());
        return tweet;
    },

    async getTweet(userId, tweetId) {
        const docRef = doc(db, `users/${userId}/savedTweets/${tweetId}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return Tweet.fromFirestore(docSnap.id, docSnap.data());
        }
        return null;
    },

    async getUserTweets(userId) {
        if (!userId) return [];
        
        const tweetsRef = collection(db, `users/${userId}/savedTweets`);
        const q = query(tweetsRef, orderBy('savedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => 
            Tweet.fromFirestore(doc.id, doc.data())
        );
    },

    async deleteTweet(userId, tweetId) {
        await deleteDoc(doc(db, `users/${userId}/savedTweets/${tweetId}`));
    },

    async addTweetToCollection(userId, tweetId, collectionId) {
        const tweetRef = doc(db, `users/${userId}/savedTweets/${tweetId}`);
        const tweetDoc = await getDoc(tweetRef);
        
        if (tweetDoc.exists()) {
            const tweet = Tweet.fromFirestore(tweetDoc.id, tweetDoc.data());
            if (!tweet.collections.includes(collectionId)) {
                tweet.collections.push(collectionId);
                await setDoc(tweetRef, tweet.toFirestore());
            }
        }
    },

    async removeTweetFromCollection(userId, tweetId, collectionId) {
        const tweetRef = doc(db, `users/${userId}/savedTweets/${tweetId}`);
        const tweetDoc = await getDoc(tweetRef);
        
        if (tweetDoc.exists()) {
            const tweet = Tweet.fromFirestore(tweetDoc.id, tweetDoc.data());
            tweet.collections = tweet.collections.filter(id => id !== collectionId);
            await setDoc(tweetRef, tweet.toFirestore());
        }
    }
}; 