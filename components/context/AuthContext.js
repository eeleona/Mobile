import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Add token state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          const decodedUser = jwtDecode(storedToken);
          setUser(decodedUser);
          setToken(storedToken); // Set the token in state
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        await AsyncStorage.removeItem('token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newToken) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      const decodedUser = jwtDecode(newToken);
      setUser(decodedUser);
      setToken(newToken); // Set the token in state
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, // Expose token
      setUser, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;