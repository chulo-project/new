import { User } from '../types';

const USERS_KEY = 'recipe_app_users';
const CURRENT_USER_KEY = 'recipe_app_current_user';

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const createUser = (name: string, email: string, password: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString(),
    searchHistory: [],
    favoriteRecipes: [],
    savedRecipes: []
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const findUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
    setCurrentUser(updatedUser);
  }
};