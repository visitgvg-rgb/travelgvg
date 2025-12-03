import React from 'react';

const SkeletonAccommodationCard: React.FC = () => {
    return (
        <div className="relative h-96 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden shimmer"></div>
    );
};

export default SkeletonAccommodationCard;