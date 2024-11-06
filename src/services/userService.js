import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../models/User';

export const userService = {
    async createUser(userData) {
        const user = new User(userData);
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, user.toFirestore());
        return user;
    },

    async getUser(userId) {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return User.fromFirestore(userSnap.id, userSnap.data());
        }
        return null;
    },

    async updateUser(userId, userData) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, userData);
    },

    async updateLastLogin(userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            lastLoginAt: new Date()
        });
    }
}; 