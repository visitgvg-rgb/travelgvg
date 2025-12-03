import React from 'react';

const SectionSkeleton: React.FC = () => (
    <div className="py-8 md:py-16" style={{ minHeight: '500px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mb-3"></div>
                <div className="h-1 bg-gray-300 dark:bg-gray-700 rounded w-24 mx-auto mb-16"></div>
                <div className="flex overflow-hidden space-x-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:space-x-0 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex-shrink-0 w-[85%] sm:w-80 md:w-auto">
                       <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className="flex-shrink-0 w-[85%] sm:w-80 md:w-auto hidden md:block">
                       <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                     <div className="flex-shrink-0 w-[85%] sm:w-80 md:w-auto hidden lg:block">
                       <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                     <div className="flex-shrink-0 w-[85%] sm:w-80 md:w-auto hidden lg:block">
                       <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
export default SectionSkeleton;