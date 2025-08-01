import React, { useState } from 'react';
import { ChefHat, TrendingUp, Search, Shuffle, Filter, Camera, Users, BookOpen, MessageSquare, X, BarChart3, Star } from 'lucide-react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import SearchButton from '../components/SearchButton';
import FormField from '../components/FormField';
import CTASection from '../components/CTASection';
import { mockRecipes } from '../data/mockRecipes';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, addToSearchHistory } = useAuth();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Event handlers
  const handleSearch = (query: string) => {
    addToSearchHistory(query);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const handleLuckySearch = () => {
    const randomRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
    window.location.href = `/recipe/${randomRecipe.id}`;
  };

  const handleImageSearch = () => {
    alert('Image search feature coming soon! Upload a photo of ingredients or a dish to find similar recipes.');
  };

  const handleRecipeClick = (recipeId: string) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  // Constants
  const STATS_DATA = [
    { icon: Users, value: '25,000+', label: 'Active Users', gradientFrom: 'from-blue-500', gradientTo: 'to-purple-500' },
    { icon: BookOpen, value: '10,000+', label: 'Recipe Collection', gradientFrom: 'from-orange-500', gradientTo: 'to-red-500' },
    { icon: MessageSquare, value: '50,000+', label: 'Recipe Reviews', gradientFrom: 'from-green-500', gradientTo: 'to-emerald-500' },
    { icon: ChefHat, value: '4.8/5', label: 'Average Rating', gradientFrom: 'from-yellow-500', gradientTo: 'to-orange-500' }
  ];

  const ADVANCED_SEARCH_FIELDS = [
    {
      label: 'Cuisine Type',
      options: [
        { value: '', label: 'Any Cuisine' },
        { value: 'italian', label: 'Italian' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'indian', label: 'Indian' },
        { value: 'thai', label: 'Thai' },
        { value: 'american', label: 'American' },
        { value: 'greek', label: 'Greek' }
      ]
    },
    {
      label: 'Difficulty',
      options: [
        { value: '', label: 'Any Difficulty' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
      ]
    },
    {
      label: 'Dietary Preferences',
      options: [
        { value: '', label: 'Any Diet' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'gluten-free', label: 'Gluten Free' },
        { value: 'keto', label: 'Keto' },
        { value: 'paleo', label: 'Paleo' }
      ]
    }
  ];

  // Data
  const featuredRecipes = mockRecipes.slice(0, 6);
  const popularRecipes = mockRecipes.filter(recipe => recipe.rating >= 4.7).slice(0, 4);

  // CTA data
  const guestCTAData = {
    title: "Ready to Start Cooking?",
    description: "Join thousands of home cooks who have discovered their new favorite recipes with RecipeFind.",
    buttons: [
      { text: "Get Started Free", onClick: () => window.location.href = '/register' }
    ]
  };

  const userCTAData = {
    title: "Keep Exploring Amazing Recipes!",
    description: "Discover new flavors, save your favorites, and create memorable meals for your loved ones.",
    buttons: [
      { text: "Browse All Recipes", onClick: () => window.location.href = '/search', icon: Search },
      { text: "View My Profile", onClick: () => window.location.href = '/profile', variant: 'secondary' as const }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5" />
        <div className="relative max-w-4xl mx-auto text-center w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
          </div>
          
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
                  title="Image Search"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Search Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex justify-center space-x-3">
                <SearchButton
                  onClick={() => handleSearch('')}
                  icon={Search}
                  text="Search Recipes"
                  className="hidden sm:flex"
                />
                <SearchButton
                  onClick={handleLuckySearch}
                  icon={Shuffle}
                  text="I'm Feeling Lucky"
                  variant="primary"
                />
              </div>
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
                  <div className="p-6 overflow-y-auto scrollbar-hide" style={{ maxHeight: '60vh' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ADVANCED_SEARCH_FIELDS.map((field, index) => (
                        <FormField
                          key={index}
                          {...field}
                      />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => setShowAdvancedSearch(false)}
                        className="w-full sm:w-auto px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowAdvancedSearch(false);
                          handleSearch('advanced');
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center space-x-3 justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Statistics</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Join our growing community of food enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS_DATA.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                gradientFrom={stat.gradientFrom}
                gradientTo={stat.gradientTo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes - Only for logged in users */}
      {user && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center space-x-3 justify-center mb-4">
                <Star className="w-8 h-8 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
              </div>
                <p className="text-gray-600 dark:text-gray-400">Hand-picked recipes just for you</p>
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
      <section className="py-4 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center space-x-3 justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular This Week</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center">Most loved recipes by our community</p>
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
      <div className="bg-gray-100 dark:bg-gray-800/50">
        <CTASection {...(user ? userCTAData : guestCTAData)} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;