import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'select' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  type = 'select', 
  placeholder, 
  options = [],
  value,
  onChange 
}) => {
  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {type === 'select' ? (
        <select 
          className={baseInputClasses}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          placeholder={placeholder}
          className={baseInputClasses}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
};

export default FormField;