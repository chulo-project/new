import React from 'react';
import { Clock, Users, Star, Heart, Bookmark } from 'lucide-react';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';

const truncateDescription = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const { user, addToFavorites, removeFromFavorites, addToSaved, removeFromSaved } = useAuth();
  
  const isFavorite = user?.favoriteRecipes.includes(recipe.id) || false;
  const isSaved = user?.savedRecipes.includes(recipe.id) || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    if (isFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    if (isSaved) {
      removeFromSaved(recipe.id);
    } else {
      addToSaved(recipe.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group border dark:border-gray-700"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          {user && (
            <>
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleSaveClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isSaved 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {recipe.title}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {recipe.rating}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          <span className="hidden lg:inline">
            {truncateDescription(recipe.description, 150)}
          </span>
          <span className="hidden md:inline lg:hidden">
            {truncateDescription(recipe.description, 100)}
          </span>
          <span className="inline md:hidden">
            {truncateDescription(recipe.description, 50)}
          </span>
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
          </div>
          <div className="text-orange-600 dark:text-orange-400 font-medium">
            {recipe.calories} cal
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;