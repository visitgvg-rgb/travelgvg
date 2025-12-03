
import React from 'react';

const TicketIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18M15 6a2.25 2.25 0 00-2.25-2.25H11.25a2.25 2.25 0 00-2.25 2.25v12l-3-1.5-3 1.5v-12A2.25 2.25 0 015.25 6H9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75h1.5a2.25 2.25 0 012.25 2.25v12l-3-1.5-3 1.5v-12a2.25 2.25 0 012.25-2.25H15z" />
    </svg>
);

export default TicketIcon;
