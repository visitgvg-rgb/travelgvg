
import React from 'react';

const CasinoChipIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {/* Straw (Left side) */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12L6.75 3" />
        
        {/* Lemon Slice (Right side rim) */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5a2.25 2.25 0 1 0-2.25-2.25" />
        
        {/* Glass Bowl */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h15L12 18.75 4.5 7.5z" />
        
        {/* Stem */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v3.75" />
        
        {/* Base */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 22.5h7.5" />
    </svg>
);

export default CasinoChipIcon;
