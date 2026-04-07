import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    // This is now handled by onSnapshot, but we keep it for compatibility
  };

  useEffect(() => {
    console.log("AuthContext: Setting up onAuthStateChanged");
    let unsubscribeSnapshot: (() => void) | null = null;

    // Prevent infinite loading if Firebase connection fails or is slow
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("AuthContext: Auth state changed", currentUser?.uid || "No user");
      setUser(currentUser);
      
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching user data snapshot:', error);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    }, (error) => {
      console.error("AuthContext: onAuthStateChanged error", error);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, refreshUserData }}>
      {loading ? (
        <div className="min-h-screen bg-[#0B1D3A] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#c8ff00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
