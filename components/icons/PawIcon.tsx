import React from 'react';

const PawIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM13.5 4.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM19.5 6.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM19.89 12.39a3.75 3.75 0 0 0-3.32-2.633 4.5 4.5 0 0 0-9.14 0 3.75 3.75 0 0 0-3.32 2.633 3.375 3.375 0 0 0 .52 3.655l.89.89a6.75 6.75 0 0 0 13.04 0l.89-.89a3.375 3.375 0 0 0 .44-3.655Z" />
    </svg>
);

export default PawIcon;