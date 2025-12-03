
import React from 'react';

const GrapeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {/* Stem */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.5V2.5" />
        {/* Leaf */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.5c2.5-2 5.5-.5 5.5 2.5" />
        
        {/* Grapes - Row 1 (Top) */}
        <circle cx="7" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Grapes - Row 2 (Middle) */}
        <circle cx="9.5" cy="14.3" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14.5" cy="14.3" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Grapes - Row 3 (Bottom) */}
        <circle cx="12" cy="18.6" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default GrapeIcon;
