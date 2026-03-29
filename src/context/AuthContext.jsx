import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../js/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((currentUser) => {
            setUser(currentUser);
            setLoading(false);
            console.log('Firebase Auth Resolved:', currentUser ? currentUser.email : 'No user');
        });

        // Cleanup observer on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
