import React from 'react';

const SkeletonShoppingCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row h-full animate-pulse">
        {/* Image Part */}
        <div className="sm:w-2/5 h-48 sm:h-auto bg-gray-300 dark:bg-gray-700"></div>
        {/* Content Part */}
        <div className="sm:w-3/5 p-6 flex flex-col justify-between sm:border-l-2 sm:border-dashed sm:border-gray-200 dark:sm:border-gray-700">
            <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="mt-auto">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-full mt-4"></div>
            </div>
        </div>
    </div>
);

export default SkeletonShoppingCard;