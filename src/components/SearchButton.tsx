import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  text: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  onClick, 
  icon: Icon, 
  text, 
  variant = 'secondary',
  className = ''
}) => {
  const baseClasses = "flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium";
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
};

export default SearchButton;