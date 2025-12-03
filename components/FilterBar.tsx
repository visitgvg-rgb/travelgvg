import React from 'react';

type FilterItem = string | {
    label: string;
    icon?: React.ReactNode;
};

interface FilterBarProps {
    filters: FilterItem[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, activeFilter, onFilterChange }) => {
    return (
        // The container is made full-width relative to the page's padded container
        // by using negative margins on mobile. This allows for edge-to-edge scrolling.
        // On sm+ screens, the negative margin is removed.
        <div className="w-full overflow-x-auto hide-scrollbar">
            {/* The inner container adds padding back for mobile, aligns items left (justify-start),
                and centers them on larger screens (sm:justify-start) where scrolling isn't needed. */}
            <div className="flex space-x-2 justify-start sm:justify-start py-4 px-4 sm:px-0">
                {filters.map(filter => {
                    const label = typeof filter === 'string' ? filter : filter.label;
                    const icon = typeof filter === 'object' && filter.icon ? filter.icon : null;
                    
                    return (
                        <button
                            key={label}
                            onClick={() => onFilterChange(label)}
                            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0.5 ${
                                activeFilter === label
                                    ? 'bg-brand-accent text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {icon && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 mr-2 -ml-1' })}
                            <span>{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterBar;