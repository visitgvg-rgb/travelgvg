import React from 'react';

const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 6v12l10-6z"></path>
    </svg>
);

export default PlayIcon;