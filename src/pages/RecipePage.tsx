import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Star, Heart, Bookmark, ChefHat, Send, ThumbsUp } from 'lucide-react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { getRecipeById, mockRecipes } from '../data/mockRecipes';
import { useAuth } from '../context/AuthContext';
import { Recipe } from '../types';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const RecipePage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'reviews'>('ingredients');
  const { user, addToFavorites, removeFromFavorites, addToSaved, removeFromSaved } = useAuth();

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const recipeId = pathParts[pathParts.length - 1];
    
    if (recipeId) {
      const foundRecipe = getRecipeById(recipeId);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        // Load mock reviews
        setReviews([
          {
            id: '1',
            userId: 'user1',
            userName: 'Sarah Johnson',
            rating: 5,
            comment: 'Absolutely delicious! My family loved it. The instructions were clear and easy to follow.',
            date: '2024-01-15',
            helpful: 12
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Mike Chen',
            rating: 4,
            comment: 'Great recipe! I made a few modifications and it turned out amazing. Will definitely make again.',
            date: '2024-01-10',
            helpful: 8
          },
          {
            id: '3',
            userId: 'user3',
            userName: 'Emma Davis',
            rating: 5,
            comment: 'Perfect for a weeknight dinner. Quick, easy, and so flavorful!',
            date: '2024-01-08',
            helpful: 15
          }
        ]);
      }
    }
  }, []);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Recipe not found
            </h2>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = user?.favoriteRecipes.includes(recipe.id) || false;
  const isSaved = user?.savedRecipes.includes(recipe.id) || false;

  const handleFavoriteClick = () => {
    if (!user) return;
    if (isFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
  };

  const handleSaveClick = () => {
    if (!user) return;
    if (isSaved) {
      removeFromSaved(recipe.id);
    } else {
      addToSaved(recipe.id);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleSubmitReview = async () => {
    if (!user || !userRating || !userReview.trim()) return;

    setIsSubmittingReview(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.profilePicture,
      rating: userRating,
      comment: userReview.trim(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setUserReview('');
    setIsSubmittingReview(false);
  };

  const handleRecipeClick = (recipeId: string) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : recipe.rating;

  const recommendedRecipes = mockRecipes
    .filter(r => r.id !== recipe.id && (r.cuisine === recipe.cuisine || r.category === recipe.category))
    .slice(0, 4);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recipe Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  {user && (
                    <>
                      <button
                        onClick={handleFavoriteClick}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                          isFavorite 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={handleSaveClick}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                          isSaved 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full text-sm font-medium">
                    {recipe.cuisine}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
                    {recipe.category}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {recipe.title}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {recipe.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cook Time</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{recipe.cookTime}m</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Servings</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{recipe.servings}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Star className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <ChefHat className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{recipe.calories}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recipe Content Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
              <div className="border-b dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'ingredients', name: 'Ingredients' },
                    { id: 'instructions', name: 'Instructions' },
                    { id: 'reviews', name: `Reviews (${reviews.length})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'ingredients' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Ingredients
                    </h3>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'instructions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Instructions
                    </h3>
                    <ol className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 pt-1">{instruction}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Reviews & Ratings
                    </h3>

                    {/* Add Review Form */}
                    {user && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Write a Review
                        </h4>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1 mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setUserRating(star)}
                              className="transition-colors"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= userRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                          placeholder="Share your experience with this recipe..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-3"
                          rows={3}
                        />

                        <button
                          onClick={handleSubmitReview}
                          disabled={!userRating || !userReview.trim() || isSubmittingReview}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                        </button>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b dark:border-gray-700 pb-4 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.userName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {review.userName}
                                </h5>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">
                                {review.comment}
                              </p>
                              <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Recommended Recipes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                You Might Also Like
              </h3>
              <div className="space-y-4">
                {recommendedRecipes.map((recommendedRecipe) => (
                  <div
                    key={recommendedRecipe.id}
                    onClick={() => handleRecipeClick(recommendedRecipe.id)}
                    className="flex space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                    <img
                      src={recommendedRecipe.image}
                      alt={recommendedRecipe.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                        {recommendedRecipe.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {recommendedRecipe.rating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {recommendedRecipe.cookTime}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;