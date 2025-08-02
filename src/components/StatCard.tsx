import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  gradientFrom: string;
  gradientTo: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, gradientFrom, gradientTo }) => {
  return (
    <div className="text-center p-6 bg-gray-200 dark:bg-gray-700 rounded-2xl">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
};

export default StatCard;