import React from 'react';

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`relative h-96 rounded-lg bg-gray-300 dark:bg-gray-700 shadow-md overflow-hidden shimmer ${className}`}>
        </div>
    );
};

export default SkeletonCard;