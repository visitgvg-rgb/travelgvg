import React from 'react';

const SkeletonPosterCard: React.FC = () => (
    <div className="w-48 h-full rounded-lg shadow-lg overflow-hidden shimmer bg-gray-300 dark:bg-gray-700">
        <div className="aspect-[10/16]"></div>
    </div>
);

export default SkeletonPosterCard;