import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('token');
        if (t) setToken(t);
      } catch (e) {
        console.warn('Auth load error', e);
      }
    })();
  }, []);

  const saveToken = async (t) => {
    setToken(t);
    try {
      await AsyncStorage.setItem('token', t);
    } catch (e) {
      console.warn('Error saving token', e);
    }
  };

  const logout = async () => {
    setToken(null);
    try { await AsyncStorage.removeItem('token'); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
