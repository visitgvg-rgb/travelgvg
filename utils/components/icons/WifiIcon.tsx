
import React from 'react';

const WifiIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 19.5a3.75 3.75 0 1 1 7.5 0v-6.75h-7.5v6.75zM15.75 12.75v-6.75a3.75 3.75 0 1 0-7.5 0v6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.562a4.5 4.5 0 0 1 7.778 0M12 20.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.008zM4.875 12.125a7.5 7.5 0 0 1 14.25 0M1.5 8.625a12 12 0 0 1 21 0" />
    </svg>
);

export default WifiIcon;
