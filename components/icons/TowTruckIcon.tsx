
import React from 'react';

const TowTruckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 16.03a7.5 7.5 0 01-1.227 1.227M8.09 16.03a7.5 7.5 0 001.227 1.227" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75h15" />
    </svg>
);

export default TowTruckIcon;
