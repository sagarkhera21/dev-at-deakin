import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

// Create a new context to hold authentication data
const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Store the current logged-in user (null if not logged in)
  const [currentUser, setCurrentUser] = useState(null);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth changes (login/logout)
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);  
      setLoading(false);   
    });

    // Cleanup listener on component unmount
    return unsub;
  }, []);

  return (
 
    <AuthContext.Provider value={{ currentUser }}>
      {/* Render children only after auth state is determined */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
