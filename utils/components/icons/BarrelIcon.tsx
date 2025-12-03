
import React from 'react';

const BarrelIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <ellipse cx="12" cy="6" rx="7" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="12" cy="18" rx="7" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 6V18 C5 21, 19 21, 19 18 V6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10H19" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 14H19" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default BarrelIcon;
