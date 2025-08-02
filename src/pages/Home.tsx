import React, { useState, useEffect } from 'react';
import { ChefHat, TrendingUp, Search, Shuffle, Filter, Camera, Users, BookOpen, MessageSquare, X, BarChart3, Star, User } from 'lucide-react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import SearchButton from '../components/SearchButton';
import FormField from '../components/FormField';
import CTASection from '../components/CTASection';
import ScrollToTop from '../components/ScrollToTop';
import { mockRecipes } from '../data/mockRecipes';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, addToSearchHistory } = useAuth();
  const [query, setQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLuckySearching, setIsLuckySearching] = useState(false);
  const [isImageSearching, setIsImageSearching] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState<typeof mockRecipes>([]);
  const [popularRecipes, setPopularRecipes] = useState<typeof mockRecipes>([]);
  const [statsData, setStatsData] = useState([
    { icon: Users, value: '0', label: 'Active Users', gradientFrom: 'from-blue-500', gradientTo: 'to-purple-500' },
    { icon: BookOpen, value: '0', label: 'Recipe Collection', gradientFrom: 'from-orange-500', gradientTo: 'to-red-500' },
    { icon: MessageSquare, value: '0', label: 'Recipe Reviews', gradientFrom: 'from-green-500', gradientTo: 'to-emerald-500' },
    { icon: User, value: '0', label: 'Visitors Today', gradientFrom: 'from-yellow-500', gradientTo: 'to-orange-500' }
  ]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate API call for platform statistics
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatsData([
        { icon: Users, value: '25,000+', label: 'Active Users', gradientFrom: 'from-blue-500', gradientTo: 'to-purple-500' },
        { icon: BookOpen, value: '10,000+', label: 'Recipe Collection', gradientFrom: 'from-orange-500', gradientTo: 'to-red-500' },
        { icon: MessageSquare, value: '50,000+', label: 'Recipe Reviews', gradientFrom: 'from-green-500', gradientTo: 'to-emerald-500' },
        { icon: User, value: '1,247', label: 'Visitors Today', gradientFrom: 'from-yellow-500', gradientTo: 'to-orange-500' }
      ]);
      setIsLoadingStats(false);
    };

    fetchStats();
  }, []);

  // Simulate API call for featured recipes
  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      if (!user) return;
      
      setIsLoadingFeatured(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFeaturedRecipes(mockRecipes.slice(0, 6));
      setIsLoadingFeatured(false);
    };

    fetchFeaturedRecipes();
  }, [user]);

  // Simulate API call for popular recipes
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      setIsLoadingPopular(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      setPopularRecipes(mockRecipes.filter(recipe => recipe.rating >= 4.7).slice(0, 4));
      setIsLoadingPopular(false);
    };

    fetchPopularRecipes();
  }, []);

  // Event handlers
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (query.trim()) {
        addToSearchHistory(query);
      }
      
      // Build URL with filters
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set('q', query.trim());
      }
      if (selectedCuisine && selectedCuisine !== '') {
        params.set('cuisine', selectedCuisine);
      }
      if (selectedDifficulty && selectedDifficulty !== '') {
        params.set('difficulty', selectedDifficulty);
      }
      if (selectedDietary && selectedDietary !== '') {
        params.set('dietary', selectedDietary);
      }
      
      const searchUrl = params.toString() ? `/search?${params.toString()}` : '/search';
      window.location.href = searchUrl;
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLuckySearch = async () => {
    setIsLuckySearching(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const randomRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
      window.location.href = `/recipe/${randomRecipe.id}`;
    } catch (error) {
      console.error('Lucky search failed:', error);
    } finally {
      setIsLuckySearching(false);
    }
  };

  const handleImageSearch = async () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImageSearching(true);

    try {
      // Simulate image processing API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to search results with image search indicator
      window.location.href = '/search?q=image_search_results&type=image';
    } catch (error) {
      console.error('Image search failed:', error);
    } finally {
      setIsImageSearching(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  const ADVANCED_SEARCH_FIELDS = [
    {
      label: 'Cuisine Type',
      value: selectedCuisine,
      onChange: setSelectedCuisine,
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
      value: selectedDifficulty,
      onChange: setSelectedDifficulty,
      options: [
        { value: '', label: 'Any Difficulty' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
      ]
    },
    {
      label: 'Dietary Preferences',
      value: selectedDietary,
      onChange: setSelectedDietary,
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
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchBar 
                onSearch={handleSearch} 
                query={query}
                setQuery={setQuery}
                large={true}
                placeholder={isMobile ? "Search..." : "Search by ingredients, recipe name, cuisine..."}
                onAdvancedSearchToggle={() => setShowAdvancedSearch(!showAdvancedSearch)}
                onImageSearch={handleImageSearch}
                showAdvancedSearch={showAdvancedSearch}
              />
            </div>

            {/* Hidden file input for image search */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Search Buttons Container */}
            <div className="mt-6 ">
              {/* Mobile Advanced Search Button */}
              {isMobile && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Advanced Search</span>
                  </button>
                </div>
              )}
              
              {/* Search Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="hidden sm:block">
                  <SearchButton
                    onClick={() => handleSearch(query)}
                    icon={Search}
                    text={isSearching ? "Searching..." : isImageSearching ? "Processing Image..." : "Search Recipes"}
                    disabled={isSearching || isImageSearching || !query.trim()}
                  />
                </div>
                <SearchButton
                  onClick={handleLuckySearch}
                  icon={Shuffle}
                  text={isLuckySearching ? "Finding Recipe..." : "I'm Feeling Lucky"}
                  variant="primary"
                  disabled={isLuckySearching || isImageSearching}
                />
              </div>
            </div>
          </div>

            {/* Advanced Search Panel */}
            {showAdvancedSearch && (
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50"
                        disabled={isSearching}
                      >
                       Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-left">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Statistics</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Join our growing community of food enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index}>
                {isLoadingStats ? (
                  <div className="text-center p-6 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                ) : (
                  <StatCard
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                gradientFrom={stat.gradientFrom}
                gradientTo={stat.gradientTo}
              />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes - Only for logged in users */}
      {user && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-left">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-8 h-8 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">Hand-picked recipes just for you</p>
                <button 
                  onClick={() => window.location.href = '/search'}
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>View All</span>
                </button>
              </div>
            </div>
            
            {isLoadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 animate-pulse">
                    <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => handleRecipeClick(recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular This Week */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-left">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular This Week</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Most loved recipes by our community</p>
          </div>
          
          {isLoadingPopular ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 animate-pulse">
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-gray-100 dark:bg-gray-800/50">
        <CTASection {...(user ? userCTAData : guestCTAData)} />
      </div>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;