import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CTAButton {
  text: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
}

interface CTASectionProps {
  title: string;
  description: string;
  buttons: CTAButton[];
}

const CTASection: React.FC<CTASectionProps> = ({ title, description, buttons }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttons.map((button, index) => {
              const Icon = button.icon;
              const baseClasses = "px-8 py-3 rounded-xl font-semibold transition-colors inline-flex items-center justify-center space-x-2";
              const variantClasses = button.variant === 'secondary'
                ? "bg-orange-600 text-white hover:bg-orange-700 border-2 border-white"
                : "bg-white text-orange-600 hover:bg-gray-100";

              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`${baseClasses} ${variantClasses}`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{button.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;