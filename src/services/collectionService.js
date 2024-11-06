import { 
    collection, doc, setDoc, getDoc, getDocs, 
    query, where, orderBy, deleteDoc, updateDoc,
    increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Collection } from '../models/Collection';

export const collectionService = {
    async createCollection(userId, collectionData) {
        const collectionsRef = collection(db, `users/${userId}/collections`);
        const newCollectionRef = doc(collectionsRef);
        const newCollection = new Collection({
            id: newCollectionRef.id,
            userId,
            ...collectionData
        });
        
        await setDoc(newCollectionRef, newCollection.toFirestore());
        return newCollection;
    },

    async getCollection(userId, collectionId) {
        const docRef = doc(db, `users/${userId}/collections/${collectionId}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return Collection.fromFirestore(docSnap.id, docSnap.data());
        }
        return null;
    },

    async getUserCollections(userId) {
        const collectionsRef = collection(db, `users/${userId}/collections`);
        const q = query(collectionsRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => 
            Collection.fromFirestore(doc.id, doc.data())
        );
    },

    async updateCollection(userId, collectionId, data) {
        const docRef = doc(db, `users/${userId}/collections/${collectionId}`);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date()
        });
    },

    async deleteCollection(userId, collectionId) {
        await deleteDoc(doc(db, `users/${userId}/collections/${collectionId}`));
    }
}; 