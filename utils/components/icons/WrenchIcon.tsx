
import React from 'react';

const WrenchIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 01.8 0l2.47 2.47a.563.563 0 010 .8l-2.47 2.471a.563.563 0 01-.8 0L11.42 15.17z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25l8.25 8.25" />
    </svg>
);

export default WrenchIcon;
