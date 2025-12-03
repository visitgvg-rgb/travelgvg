import React from 'react';

const InteriorIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m5.25-8.25l-5.25 6 5.25 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25h16.5a1.5 1.5 0 011.5 1.5v4.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V9.75a1.5 1.5 0 011.5-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 20.25v-4.5" />
    </svg>
);

export default InteriorIcon;
