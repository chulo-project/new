import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, X, Filter, Camera } from 'lucide-react';
import { getSearchSuggestions } from '../data/mockRecipes';
import { useAuth } from '../context/AuthContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  large?: boolean;
  onAdvancedSearchToggle?: () => void;
  onImageSearch?: () => void;
  showAdvancedSearch?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for recipes...", 
  className = "",
  large = false,
  onAdvancedSearchToggle,
  onImageSearch,
  showAdvancedSearch = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (user) {
      setSearchHistory(user.searchHistory);
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Enhanced API call to fetch suggestions
  const fetchSuggestions = async (searchQuery: string, signal?: AbortSignal): Promise<string[]> => {
    try {
      // Enhanced API suggestions with better logic
      const baseSuggestions = getSearchSuggestions(searchQuery);
      
      // Generate contextual suggestions based on query
      const contextualSuggestions: string[] = [];
      
      if (searchQuery.length >= 2) {
        // Add recipe-specific suggestions
        contextualSuggestions.push(
          `${searchQuery} recipe`,
          `best ${searchQuery}`,
          `easy ${searchQuery}`,
          `healthy ${searchQuery}`,
          `quick ${searchQuery}`,
          `${searchQuery} ingredients`
        );
      }
      
      // Combine and deduplicate suggestions
      const allSuggestions = [
        ...baseSuggestions,
        ...contextualSuggestions.filter(s => 
          !baseSuggestions.some(base => 
            base.toLowerCase().includes(s.toLowerCase()) || 
            s.toLowerCase().includes(base.toLowerCase())
          )
        )
      ];
      
      // Check if request was aborted
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }
      
      return allSuggestions.slice(0, 8);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      // Fallback to basic suggestions on error
      return getSearchSuggestions(searchQuery).slice(0, 6);
    }
  };

  const handleInputChange = (value: string) => {
    setIsKeyboardNavigation(false);
    
    setQuery(value);
    setSelectedIndex(-1);
    
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (value.trim()) {
      // Make API call for queries with 3 or more characters
      if (value.trim().length >= 3) {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        
        setIsLoadingSuggestions(true);
        
        fetchSuggestions(value.trim(), abortController.signal)
          .then(apiSuggestions => {
            if (!abortController.signal.aborted) {
              setSuggestions(apiSuggestions);
              setIsLoadingSuggestions(false);
              setShowSuggestions(apiSuggestions.length > 0);
            }
          })
          .catch(error => {
            if (!abortController.signal.aborted) {
              console.error('Failed to fetch suggestions:', error);
              // No fallback - no suggestions for failed API calls
              setSuggestions([]);
              setIsLoadingSuggestions(false);
              setShowSuggestions(false);
            }
          });
      } else if (value.trim().length > 0 && value.trim().length < 3) {
        // For 1-2 character queries, show no suggestions
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoadingSuggestions(false);
      } else {
        // This shouldn't happen since we're inside if (value.trim())
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(user && searchHistory.length > 0);
      setIsLoadingSuggestions(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    // Abort any pending API calls
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoadingSuggestions(false);
    
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setQuery(searchQuery.trim());
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If a suggestion is selected, use it; otherwise use the current query
    const allSuggestions = query.trim() ? suggestions : searchHistory.slice(0, 5);
    if (selectedIndex >= 0 && selectedIndex < allSuggestions.length) {
      handleSearch(allSuggestions[selectedIndex]);
    } else {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const allSuggestions = query.trim() ? suggestions : searchHistory.slice(0, 5);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedIndex(prev => {
          const newIndex = prev < allSuggestions.length - 1 ? prev + 1 : prev;
          if (newIndex >= 0 && newIndex < allSuggestions.length) {
            setQuery(allSuggestions[newIndex]);
          }
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : -1;
          if (newIndex === -1) {
            // Reset to original query when going back to -1
            setQuery(query.trim() ? query : '');
          } else if (newIndex >= 0 && newIndex < allSuggestions.length) {
            setQuery(allSuggestions[newIndex]);
          }
          return newIndex;
        });
        break;
      case 'Escape':
        // Abort any pending API calls
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        setIsLoadingSuggestions(false);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (selectedIndex >= 0 && selectedIndex < allSuggestions.length) {
          e.preventDefault();
          setSelectedIndex(-1);
        }
        break;
    }
  };
  const handleFocus = () => {
    setSelectedIndex(-1);
    if (!query.trim()) {
      // Show search history only if user is logged in and has history
      setShowSuggestions(user && searchHistory.length > 0);
    } else if (query.trim().length >= 3) {
      // For queries with 3+ characters, fetch suggestions if not already loaded
      if (suggestions.length === 0 && !isLoadingSuggestions) {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        
        setIsLoadingSuggestions(true);
        
        fetchSuggestions(query.trim(), abortController.signal)
          .then(apiSuggestions => {
            if (!abortController.signal.aborted) {
              setSuggestions(apiSuggestions);
              setIsLoadingSuggestions(false);
              setShowSuggestions(apiSuggestions.length > 0);
            }
          })
          .catch(error => {
            if (!abortController.signal.aborted) {
              setSuggestions([]);
              setIsLoadingSuggestions(false);
              setShowSuggestions(false);
            }
          });
      } else if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    } else {
      // For 1-2 character queries, hide suggestions
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    // Abort any pending API calls
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoadingSuggestions(false);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleAdvancedSearchClick = () => {
    if (onAdvancedSearchToggle) {
      onAdvancedSearchToggle();
    }
  };

  const handleImageSearchClick = () => {
    if (onImageSearch) {
      onImageSearch();
    }
  };

  const baseInputClasses = large 
    ? "w-full pl-12 pr-32 py-4 text-lg rounded-2xl"
    : "w-full pl-10 pr-20 py-3 rounded-xl";

  return (
    <div className={`relative ${className}`} ref={suggestionRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={large ? (window.innerWidth < 640 ? "Search..." : placeholder) : placeholder}
            className={`${baseInputClasses} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          />
          
          {/* Right side icons container */}
          <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2`}>
            {query && (
              <>
                <button
                  type="button"
                  onClick={clearSearch}
                  className={`text-gray-400 hover:text-orange-500 transition-colors`}
                >
                  <X className={`${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
                </button>
                
                {/* Vertical separator */}
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />
                
                {/* Desktop: Filter + Camera icons */}
                {!isMobile && large && (
                  <button
                    type="button"
                    onClick={handleAdvancedSearchClick}
                    className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    title="Advanced Search"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                )}
                
                {/* Camera icon for all widths */}
                <button
                  type="button"
                  onClick={handleImageSearchClick}
                  className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                  title="Image Search"
                >
                  <Camera className={`${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
                </button>
              </>
            )}
            
            {/* Show icons even when no query on large screens */}
            {!query && large && (
              <>
                {!isMobile && (
                  <button
                    type="button"
                    onClick={handleAdvancedSearchClick}
                    className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    title="Advanced Search"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleImageSearchClick}
                  className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                  title="Image Search"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto scrollbar-hide">
          {isLoadingSuggestions && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Loading suggestions...</span>
              </div>
            </div>
          )}
          
          {query.trim() && suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedIndex === index
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Search className={`w-4 h-4 ${
                    selectedIndex === index ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <span className="text-gray-900 dark:text-white">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && searchHistory.length > 0 && (
            <div className="p-2">
              {searchHistory.slice(0, 5).map((historyItem, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(historyItem)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedIndex === index
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Clock className={`w-4 h-4 ${
                    selectedIndex === index ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <span className="text-gray-900 dark:text-white">{historyItem}</span>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && suggestions.length === 0 && searchHistory.length === 0 && !isLoadingSuggestions && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No suggestions available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;