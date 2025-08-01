import React, { useState } from 'react';
import { ChefHat, TrendingUp, Star, Clock, Search, Shuffle, Filter, Camera, Users, BookOpen, MessageSquare, X } from 'lucide-react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';
import { mockRecipes } from '../data/mockRecipes';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, addToSearchHistory } = useAuth();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  const handleSearch = (query: string) => {
    addToSearchHistory(query);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const handleLuckySearch = () => {
    const randomRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
    window.location.href = `/recipe/${randomRecipe.id}`;
  };

  const handleImageSearch = () => {
    // Placeholder for image search functionality
    alert('Image search feature coming soon! Upload a photo of ingredients or a dish to find similar recipes.');
  };

  const featuredRecipes = mockRecipes.slice(0, 6);
  const popularRecipes = mockRecipes.filter(recipe => recipe.rating >= 4.7).slice(0, 4);

  const handleRecipeClick = (recipeId: string) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {user ? (
              <>
                Welcome back,
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {user.name.split(' ')[0]}!
                </span>
              </>
            ) : (
              <>
                Discover Your Next
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Favorite Recipe
                </span>
              </>
            )}
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <SearchBar 
                onSearch={handleSearch} 
                large={true}
                placeholder="Search by ingredients, recipe name, cuisine..."
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                  title="Advanced Search"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  onClick={handleImageSearch}
                  className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                  title="Search by Image"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Search Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSearch('')}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <Search className="w-4 h-4" />
                <span>Search Recipes</span>
              </button>
              <button
                onClick={handleLuckySearch}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
              >
                <Shuffle className="w-4 h-4" />
                <span>I'm Feeling Lucky</span>
              </button>
            </div>

            {/* Advanced Search Panel */}
            {showAdvancedSearch && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Advanced Search</h3>
                    <button
                      onClick={() => setShowAdvancedSearch(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`
                      .overflow-y-auto::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cuisine Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">Any Cuisine</option>
                          <option value="italian">Italian</option>
                          <option value="mexican">Mexican</option>
                          <option value="indian">Indian</option>
                          <option value="thai">Thai</option>
                          <option value="american">American</option>
                          <option value="greek">Greek</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Difficulty
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">Any Difficulty</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Cook Time (minutes)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 30"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Calories
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dietary Preferences
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">Any Diet</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="gluten-free">Gluten Free</option>
                          <option value="keto">Keto</option>
                          <option value="paleo">Paleo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Meal Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">Any Meal</option>
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="snack">Snack</option>
                          <option value="dessert">Dessert</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAdvancedSearch(false)}
                        className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowAdvancedSearch(false);
                          handleSearch('advanced');
                        }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-orange-500 rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border-2 border-red-500 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-orange-400 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 border-2 border-red-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-orange-300 rounded-full"></div>
          
          {/* Spiral Pattern */}
          <svg className="absolute top-1/4 right-10 w-24 h-24" viewBox="0 0 100 100">
            <path d="M50,10 Q90,50 50,90 Q10,50 50,10" stroke="currentColor" strokeWidth="2" fill="none" className="text-orange-500" />
          </svg>
          <svg className="absolute bottom-1/4 left-10 w-20 h-20" viewBox="0 0 100 100">
            <path d="M20,20 Q80,20 80,80 Q20,80 20,20" stroke="currentColor" strokeWidth="2" fill="none" className="text-red-500" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Statistics</h2>
            <p className="text-gray-600 dark:text-gray-400">Join our growing community of food enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">25,000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10,000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Recipe Collection</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50,000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Recipe Reviews</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.8/5</h3>
              <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes - Only for logged in users */}
      {user && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Recipes</h2>
                <p className="text-gray-600 dark:text-gray-400">Hand-picked recipes just for you</p>
              </div>
              <button 
                onClick={() => window.location.href = '/search'}
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium flex items-center space-x-1 transition-colors"
              >
                <span>View All</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular This Week */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Popular This Week</h2>
                <p className="text-gray-600 dark:text-gray-400">Most loved recipes by our community</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user ? (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Cooking?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Join thousands of home cooks who have discovered their new favorite recipes with RecipeFind.
              </p>
              <button 
                onClick={() => window.location.href = '/register'}
                className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              >
                <span>Get Started Free</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Keep Exploring Amazing Recipes!
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Discover new flavors, save your favorites, and create memorable meals for your loved ones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/search'}
                  className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Browse All Recipes</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors inline-flex items-center justify-center space-x-2 border-2 border-white"
                >
                  <span>View My Profile</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Home;