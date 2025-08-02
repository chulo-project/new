import React, { useRef, useEffect, useState } from 'react';
import { DivideIcon as LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: LucideIcon;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tabs]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="border-b dark:border-gray-700">
        {/* Left scroll button */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 dark:to-transparent pl-2 pr-4 flex items-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}

        {/* Scrollable tabs container */}
        <div
          ref={scrollContainerRef}
          className={`flex overflow-x-auto scrollbar-hide ${
            showLeftArrow ? 'pl-8 sm:pl-10' : 'pl-4 sm:pl-6'
          } ${
            showRightArrow ? 'pr-8 sm:pr-10' : 'pr-4 sm:pr-6'
          }`}
          onScroll={checkScrollButtons}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex space-x-2 sm:space-x-8 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap px-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
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
          </div>
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 dark:to-transparent pr-2 pl-4 flex items-center"
          >
            <ChevronRight className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;