
import React from 'react';

const UtensilsCrossedIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {/* Fork */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v7a3 3 0 0 0 6 0V3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v18" />
        
        {/* Knife */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 21V3h1.5a2.5 2.5 0 0 1 2.5 2.5v9a2.5 2.5 0 0 1-2.5 2.5H16" />
    </svg>
);

export default UtensilsCrossedIcon;
