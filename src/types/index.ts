export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: string;
  searchHistory: string[];
  favoriteRecipes: string[];
  savedRecipes: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  category: string;
  calories: number;
  rating: number;
  tags: string[];
}

export interface SearchResult {
  query: string;
  results: Recipe[];
  totalResults: number;
  searchTime: number;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addToFavorites: (recipeId: string) => void;
  removeFromFavorites: (recipeId: string) => void;
  addToSaved: (recipeId: string) => void;
  removeFromSaved: (recipeId: string) => void;
  addToSearchHistory: (query: string) => void;
  resetPassword: (email: string) => Promise<boolean>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}