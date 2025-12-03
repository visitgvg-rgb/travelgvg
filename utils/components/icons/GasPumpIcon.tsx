
import React from 'react';

const GasPumpIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {/* Base and Body */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L7.5 5.25a2.25 2.25 0 0 1 2.25-2.25h4.5a2.25 2.25 0 0 1 2.25 2.25V21m-9 0h9m-9 0H5.25m11.25 0h2.25" />
        {/* Display Screen Lines */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5h4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 10.5h4.5" />
        {/* Hose and Handle */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5h1.125a2.625 2.625 0 0 1 2.625 2.625v5.25a2.625 2.625 0 0 1-2.625 2.625H16.5" />
    </svg>
);

export default GasPumpIcon;