import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Star, Heart, Bookmark, ChefHat, Send, ThumbsUp, Download, Activity, FileText } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition' | 'reviews'>('ingredients');
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

  const generateTextFile = () => {
    // Create a simple text-based PDF content
    const textContent = `
RECIPE: ${recipe.title}

DESCRIPTION:
${recipe.description}

COOK TIME: ${recipe.cookTime} minutes
SERVINGS: ${recipe.servings}
DIFFICULTY: ${recipe.difficulty}
CUISINE: ${recipe.cuisine}
CATEGORY: ${recipe.category}

NUTRITION INFORMATION:
Calories: ${recipe.calories}
Protein: ${Math.round(recipe.calories * 0.15 / 4)}g
Carbohydrates: ${Math.round(recipe.calories * 0.55 / 4)}g
Fat: ${Math.round(recipe.calories * 0.30 / 9)}g
Fiber: ${Math.round(recipe.calories * 0.02)}g
Sugar: ${Math.round(recipe.calories * 0.08)}g
Sodium: ${Math.round(recipe.calories * 0.8)}mg

INGREDIENTS:
${recipe.ingredients.map((ingredient, index) => `${index + 1}. ${ingredient}`).join('\n')}

INSTRUCTIONS:
${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

TAGS: ${recipe.tags.join(', ')}

Generated from RecipeFind - ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download the file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDF = () => {
    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${recipe.title} - Recipe</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
        .title { color: #f97316; font-size: 28px; margin-bottom: 10px; }
        .description { font-style: italic; color: #666; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .info-item { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .info-label { font-weight: bold; color: #f97316; }
        .section { margin: 30px 0; }
        .section-title { color: #f97316; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .ingredients li, .instructions li { margin-bottom: 8px; }
        .nutrition-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .nutrition-item { display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { background: #f97316; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${recipe.title}</h1>
        <p class="description">${recipe.description}</p>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Cook Time</div>
                <div>${recipe.cookTime} minutes</div>
            </div>
            <div class="info-item">
                <div class="info-label">Servings</div>
                <div>${recipe.servings}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Difficulty</div>
                <div>${recipe.difficulty}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Calories</div>
                <div>${recipe.calories}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Ingredients</h2>
        <ul class="ingredients">
            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h2 class="section-title">Instructions</h2>
        <ol class="instructions">
            ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ol>
    </div>

    <div class="section">
        <h2 class="section-title">Nutrition Information</h2>
        <div class="nutrition-grid">
            <div class="nutrition-item">
                <span>Calories</span>
                <strong>${recipe.calories}</strong>
            </div>
            <div class="nutrition-item">
                <span>Protein</span>
                <span>${Math.round(recipe.calories * 0.15 / 4)}g</span>
            </div>
            <div class="nutrition-item">
                <span>Carbohydrates</span>
                <span>${Math.round(recipe.calories * 0.55 / 4)}g</span>
            </div>
            <div class="nutrition-item">
                <span>Fat</span>
                <span>${Math.round(recipe.calories * 0.30 / 9)}g</span>
            </div>
            <div class="nutrition-item">
                <span>Fiber</span>
                <span>${Math.round(recipe.calories * 0.02)}g</span>
            </div>
            <div class="nutrition-item">
                <span>Sugar</span>
                <span>${Math.round(recipe.calories * 0.08)}g</span>
            </div>
            <div class="nutrition-item">
                <span>Sodium</span>
                <span>${Math.round(recipe.calories * 0.8)}mg</span>
            </div>
            <div class="nutrition-item">
                <span>Per Serving</span>
                <strong>${Math.round(recipe.calories / recipe.servings)} cal</strong>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Recipe Tags</h2>
        <div class="tags">
            ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    </div>

    <div class="footer">
        <p>Recipe from RecipeFind • Generated on ${new Date().toLocaleDateString()}</p>
        <p>Cuisine: ${recipe.cuisine} • Category: ${recipe.category}</p>
    </div>
</body>
</html>
    `.trim();

    // Create and download the HTML file (which can be opened and printed as PDF)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

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

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={generatePDF}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={generateTextFile}
                      className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Text</span>
                    </button>
                  </div>
                </div>

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
                    { id: 'nutrition', name: 'Nutrition' },
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

                {activeTab === 'nutrition' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-orange-500" />
                      <span>Nutrition Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Calories</span>
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">{recipe.calories}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Protein</span>
                          <span className="text-gray-700 dark:text-gray-300">{Math.round(recipe.calories * 0.15 / 4)}g</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Carbohydrates</span>
                          <span className="text-gray-700 dark:text-gray-300">{Math.round(recipe.calories * 0.55 / 4)}g</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Fat</span>
                          <span className="text-gray-700 dark:text-gray-300">{Math.round(recipe.calories * 0.30 / 9)}g</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Fiber</span>
                          <span className="text-gray-700 dark:text-gray-300">{Math.round(recipe.calories * 0.02)}g</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Sugar</span>
                          <span className="text-gray-700 dark:text-gray-300">{Math.round(recipe.calories * 0.08)}g</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Sodium</span>
                          <span className="text-gray-700 dark:text-gray-300">{Math.round(recipe.calories * 0.8)}mg</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">Per Serving</span>
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">{Math.round(recipe.calories / recipe.servings)} cal</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        <strong>Note:</strong> Nutrition values are estimates based on typical ingredient compositions. 
                        Actual values may vary depending on specific ingredients and preparation methods used.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Reviews & Ratings
                    </h3>

                    {/* Add Review Form */}
                    {user ? (
                      <div>
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
                      </div>
                    ) : (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 dark:text-blue-200 text-center">
                          <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Sign in
                          </a> to write a review and rate this recipe.
                        </p>
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