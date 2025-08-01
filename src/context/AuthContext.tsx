import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  createUser, 
  findUserByEmail, 
  updateUser 
} from '../utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = findUserByEmail(email);
    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return false;
    }
    
    const newUser = createUser(name, email, password);
    setUser(newUser);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const addToFavorites = (recipeId: string) => {
    if (user && !user.favoriteRecipes.includes(recipeId)) {
      const updatedUser = {
        ...user,
        favoriteRecipes: [...user.favoriteRecipes, recipeId]
      };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const removeFromFavorites = (recipeId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        favoriteRecipes: user.favoriteRecipes.filter(id => id !== recipeId)
      };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const addToSaved = (recipeId: string) => {
    if (user && !user.savedRecipes.includes(recipeId)) {
      const updatedUser = {
        ...user,
        savedRecipes: [...user.savedRecipes, recipeId]
      };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const removeFromSaved = (recipeId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        savedRecipes: user.savedRecipes.filter(id => id !== recipeId)
      };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const addToSearchHistory = (query: string) => {
    if (user && query.trim()) {
      const updatedHistory = [query, ...user.searchHistory.filter(h => h !== query)].slice(0, 10);
      const updatedUser = {
        ...user,
        searchHistory: updatedHistory
      };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = findUserByEmail(email);
    return !!foundUser;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    addToSaved,
    removeFromSaved,
    addToSearchHistory,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};