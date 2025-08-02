import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Calendar, Camera, Trash2, History, Heart, Bookmark, ArrowLeft, Key, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { getRecipeById } from '../data/mockRecipes';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'saved' | 'history'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'email' | 'password' | null>(null);
  const [verificationStep, setVerificationStep] = useState<'input' | 'verify' | 'success'>('input');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isDeletingHistoryItem, setIsDeletingHistoryItem] = useState<number | null>(null);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<typeof import('../data/mockRecipes').mockRecipes>([]);
  const [savedRecipes, setSavedRecipes] = useState<typeof import('../data/mockRecipes').mockRecipes>([]);



  // Simulate loading favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      
      setIsLoadingFavorites(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const recipes = user.favoriteRecipes.map(id => getRecipeById(id)).filter(Boolean);
      setFavoriteRecipes(recipes);
      setIsLoadingFavorites(false);
    };

    loadFavorites();
  }, [user]);

  // Simulate loading saved recipes
  useEffect(() => {
    const loadSaved = async () => {
      if (!user) return;
      
      setIsLoadingSaved(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const recipes = user.savedRecipes.map(id => getRecipeById(id)).filter(Boolean);
      setSavedRecipes(recipes);
      setIsLoadingSaved(false);
    };

    loadSaved();
  }, [user]);

  // Simulate loading search history
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      setIsLoadingHistory(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsLoadingHistory(false);
    };

    loadHistory();
  }, [user]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to view your profile
            </h2>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (editingField === 'name') {
      // Name changes don't require verification
      setIsSaving(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProfile({ name: editName });
      setIsSaving(false);
      setIsEditing(false);
      setEditingField(null);
    } else if (editingField === 'email' || editingField === 'password') {
      // Email and password changes require verification
      setIsSendingCode(true);
      // Simulate API call delay for sending verification code
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerificationStep('verify');
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setIsSendingCode(false);
    }
  };

  const handleCancel = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
    setEditingField(null);
    setVerificationStep('input');
    setVerificationCode('');
    setVerificationError('');
  };

  const handleVerificationSubmit = async () => {
    if (verificationCode !== generatedCode) {
      setVerificationError('Invalid verification code. Please try again.');
      return;
    }

    if (editingField === 'password') {
      if (newPassword !== confirmPassword) {
        setVerificationError('Passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        setVerificationError('Password must be at least 6 characters long');
        return;
      }
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingField === 'email') {
        updateProfile({ email: editEmail });
      } else if (editingField === 'password') {
        // In a real app, you would update the password here
        console.log('Password updated');
      }
      
      setVerificationStep('success');
    } catch (err) {
      setVerificationError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditField = (field: 'name' | 'email' | 'password') => {
    setIsEditing(true);
    setEditingField(field);
    setVerificationStep('input');
    setVerificationError('');
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          updateProfile({
            profilePicture: e.target?.result as string
          });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleRemoveProfilePicture = () => {
    updateProfile({
      profilePicture: undefined
    });
  };

  const deleteSearchHistoryItem = (index: number) => {
    const deleteItem = async () => {
      if (!user) return;
      
      setIsDeletingHistoryItem(index);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedHistory = user.searchHistory.filter((_, i) => i !== index);
      const updatedUser = {
        ...user,
        searchHistory: updatedHistory
      };
      updateProfile(updatedUser);
      setIsDeletingHistoryItem(null);
    };
    
    deleteItem();
  };

  const clearAllSearchHistory = () => {
    const clearHistory = async () => {
      if (!user) return;
      
      setIsClearingHistory(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        searchHistory: []
      };
      updateProfile(updatedUser);
      setIsClearingHistory(false);
    };
    
    clearHistory();
  };

  const handleRecipeClick = (recipeId: string) => {
    window.location.href = `/recipe/${recipeId}`;
  };

  const handleBackClick = () => {
    window.location.href = '/';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'favorites', name: 'Favorites', icon: Heart, count: favoriteRecipes.length },
    { id: 'saved', name: 'Saved', icon: Bookmark, count: savedRecipes.length },
    { id: 'history', name: 'Search History', icon: History, count: user.searchHistory.length }
  ];

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

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button
                onClick={handleProfilePictureClick}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              {user.profilePicture && (
                <button
                  onClick={handleRemoveProfilePicture}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {isEditing ? (
                <div>
                  {verificationStep === 'input' && (
                    <div className="space-y-4">
                      {editingField === 'name' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      )}
                      
                      {editingField === 'email' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      )}
                      
                      {editingField === 'password' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={handleSave}
                          disabled={isSaving || isSendingCode}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {(isSaving || isSendingCode) && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          )}
                          <span>
                            {isSaving ? 'Saving...' : 
                             isSendingCode ? 'Sending Code...' : 
                             editingField === 'name' ? 'Save Changes' : 'Continue'}
                          </span>
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving || isSendingCode}
                          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {verificationStep === 'verify' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
                          <strong>Demo Code:</strong> {generatedCode}
                        </p>
                      </div>
                      
                      {verificationError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-red-600 dark:text-red-400 text-sm">{verificationError}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center tracking-widest"
                          placeholder="000000"
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={handleVerificationSubmit}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50"
                        >
                          {isProcessing ? 'Verifying...' : 'Verify & Save'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {verificationStep === 'success' && (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {editingField === 'email' ? 'Email Updated' : 'Password Updated'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Your {editingField} has been updated successfully.
                        </p>
                        <button
                          onClick={handleCancel}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
                    {user.name}
                  </h1>
                  <div className="flex flex-col items-center lg:items-start space-y-2 text-gray-600 dark:text-gray-400 mb-6 text-center lg:text-left">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => handleEditField('name')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
                    >
                      Edit Name
                    </button>
                    <button
                      onClick={() => handleEditField('email')}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Change Email</span>
                    </button>
                    <button
                      onClick={() => handleEditField('password')}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2"
                    >
                      <Key className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="border-b dark:border-gray-700">
            <nav className="flex flex-wrap gap-2 sm:gap-8 px-4 sm:px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
                    <Heart className="w-8 h-8" />
                    <div>
                      <p className="text-orange-100">Favorite Recipes</p>
                      <p className="text-2xl font-bold">{favoriteRecipes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
                    <Bookmark className="w-8 h-8" />
                    <div>
                      <p className="text-blue-100">Saved Recipes</p>
                      <p className="text-2xl font-bold">{savedRecipes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
                    <History className="w-8 h-8" />
                    <div>
                      <p className="text-green-100">Searches</p>
                      <p className="text-2xl font-bold">{user.searchHistory.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                {isLoadingFavorites ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
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
                ) : favoriteRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No favorite recipes yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start exploring recipes and add them to your favorites
                    </p>
                    <button
                      onClick={() => window.location.href = '/search'}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                    >
                      Browse Recipes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                {isLoadingSaved ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
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
                ) : savedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No saved recipes yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Save recipes you want to try later
                    </p>
                    <button
                      onClick={() => window.location.href = '/search'}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                    >
                      Browse Recipes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                {isLoadingHistory ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                        </div>
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : user && user.searchHistory.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Recent Searches</h4>
                      <button
                        onClick={clearAllSearchHistory}
                        disabled={isClearingHistory}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                      >
                        {isClearingHistory && (
                          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{isClearingHistory ? 'Clearing...' : 'Clear All'}</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {user.searchHistory.map((query, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group space-y-2 sm:space-y-0"
                        >
                          <div 
                            className="flex items-center space-x-3 flex-1 cursor-pointer min-w-0"
                            onClick={() => window.location.href = `/search?q=${encodeURIComponent(query)}`}
                          >
                            <History className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white truncate">{query}</span>
                          </div>
                          <button
                            onClick={() => deleteSearchHistoryItem(index)}
                            disabled={isDeletingHistoryItem === index}
                            className="opacity-0 group-hover:opacity-100 sm:opacity-100 text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 p-1 self-end sm:self-center disabled:opacity-50 flex items-center justify-center"
                          >
                            {isDeletingHistoryItem === index ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No search history yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your recent searches will appear here
                    </p>
                    <button
                      onClick={() => window.location.href = '/search'}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                    >
                      Start Searching
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;