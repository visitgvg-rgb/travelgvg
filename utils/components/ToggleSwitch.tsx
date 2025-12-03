import React from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${checked ? 'bg-brand-accent group-hover:bg-orange-600' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
      {label && (
        <div className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {label}
        </div>
      )}
    </label>
  );
};

export default ToggleSwitch;