import React, { useState, useEffect } from 'react';
import { Clock, Filter, SortDesc, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { searchRecipes, getRecipeById } from '../data/mockRecipes';
import { useAuth } from '../context/AuthContext';
import { Recipe } from '../types';

const SearchResults: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [searchTime, setSearchTime] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'time' | 'calories'>('relevance');
  const [filterBy, setFilterBy] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { user, addToSearchHistory } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    const favorites = urlParams.get('favorites') === 'true';
    const saved = urlParams.get('saved') === 'true';

    if (favorites && user) {
      const favoriteRecipes = user.favoriteRecipes.map(id => getRecipeById(id)).filter(Boolean) as Recipe[];
      setRecipes(favoriteRecipes);
      setQuery('');
      setTotalResults(favoriteRecipes.length);
      setSearchTime(0);
    } else if (saved && user) {
      const savedRecipes = user.savedRecipes.map(id => getRecipeById(id)).filter(Boolean) as Recipe[];
      setRecipes(savedRecipes);
      setQuery('');
      setTotalResults(savedRecipes.length);
      setSearchTime(0);
    } else if (searchQuery) {
      performSearch(searchQuery);
    } else {
      // Show all recipes if no query
      setRecipes([]);
      setQuery('');
      setTotalResults(0);
      setSearchTime(0);
    }
  }, [user]);

  const performSearch = (searchQuery: string) => {
    const startTime = performance.now();
    const results = searchRecipes(searchQuery);
    const endTime = performance.now();
    
    setRecipes(results);
    setQuery(searchQuery);
    setTotalResults(results.length);
    setSearchTime((endTime - startTime) / 1000);
    
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
    }
  };

  const handleSearch = (newQuery: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', newQuery);
    window.history.pushState({}, '', url.toString());
    performSearch(newQuery);
  };

  const handleRecipeClick = (recipeId: string) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  const handleBackClick = () => {
    window.location.href = '/';
  };

  const getSortedAndFilteredRecipes = () => {
    let filteredRecipes = recipes;

    // Apply difficulty filter
    if (filterBy !== 'all') {
      const difficultyMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
      filteredRecipes = recipes.filter(recipe => recipe.difficulty === difficultyMap[filterBy]);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        return [...filteredRecipes].sort((a, b) => b.rating - a.rating);
      case 'time':
        return [...filteredRecipes].sort((a, b) => a.cookTime - b.cookTime);
      case 'calories':
        return [...filteredRecipes].sort((a, b) => a.calories - b.calories);
      default:
        return filteredRecipes; // relevance (original order)
    }
  };

  const sortedAndFilteredRecipes = getSortedAndFilteredRecipes();

  const getPageTitle = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const favorites = urlParams.get('favorites') === 'true';
    const saved = urlParams.get('saved') === 'true';

    if (favorites) return 'Your Favorite Recipes';
    if (saved) return 'Your Saved Recipes';
    if (query) return `Search Results for "${query}"`;
    return 'Search Recipes';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getPageTitle()}
            </h1>
            {query && totalResults > 0 && (
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{totalResults.toLocaleString()} results</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{searchTime.toFixed(3)} seconds</span>
                </div>
              </div>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="rating">Sort by Rating</option>
              <option value="time">Sort by Cook Time</option>
              <option value="calories">Sort by Calories</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Difficulty Level</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setFilterBy(difficulty as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterBy === difficulty
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {sortedAndFilteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => handleSearch('')}
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start searching for recipes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use the search bar above to find your next favorite recipe
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;