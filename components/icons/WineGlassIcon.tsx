
import React from 'react';

const WineGlassIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 00.75-.75V12.75h-1.5v5.25a.75.75 0 00.75.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75a9 9 0 0118 0v1.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 11.25v-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75c0-1.036.293-2.018.82-2.897" />
    </svg>
);

export default WineGlassIcon;
