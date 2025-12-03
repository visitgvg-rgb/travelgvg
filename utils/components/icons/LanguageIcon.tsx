import React from 'react';

const LanguageIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-2.488.991-4.729 2.636-6.364M12 21a9 9 0 009-9c0-2.488-.991-4.729-2.636-6.364M12 21V3m0 18a9 9 0 00-9-9m9 9a9 9 0 019-9m-9 9H3m9 0h9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 8.172a4.5 4.5 0 015.656 0M3.172 15.828a4.5 4.5 0 015.656 0m6.364-7.656a4.5 4.5 0 010 5.656m6.364-5.656a4.5 4.5 0 010 5.656" />
    </svg>
);

export default LanguageIcon;
