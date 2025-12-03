
import React from 'react';

const SlotMachineIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75l.75-2.25 2.25-3 2.25 3 .75 2.25M15 15.75l.75-2.25 2.25-3 2.25 3 .75 2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9" />
    </svg>
);

export default SlotMachineIcon;
