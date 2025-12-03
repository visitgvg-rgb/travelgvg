import React from 'react';

const SkeletonOfferCard: React.FC = () => {
    return (
        <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
        >
            <div className="relative aspect-[4/3] bg-gray-300 dark:bg-gray-700 shimmer"></div>
            <div className="ticket-body flex-grow flex flex-col justify-between p-6 bg-white dark:bg-slate-900">
                <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-700 -mx-6 mb-6"></div>
                <div>
                    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-3 shimmer"></div>
                    <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2 shimmer"></div>
                </div>
                <div className="mt-auto">
                    <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4 shimmer"></div>
                    <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-lg shimmer"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonOfferCard;