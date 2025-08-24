import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config'; // We will create this file next
import { onAuthStateChanged } from 'firebase/auth';

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a listener from Firebase.
    // It automatically runs whenever a user logs in or logs out.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // This is a cleanup function that unsubscribes from the listener
    // when the component is no longer on the screen.
    return unsubscribe;
  }, []); // The empty array means this effect runs only once

  // The 'value' is what we make available to all other components
  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};