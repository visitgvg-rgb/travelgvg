
import React from 'react';
import { Link } from 'react-router-dom';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface SectionHeaderProps {
    to: string;
    title: string;
    description: string;
    className?: string;
    variant?: 'light' | 'dark';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ to, title, description, className = "", variant = 'light' }) => {
    const titleColor = variant === 'dark' ? 'text-white' : 'text-brand-text dark:text-gray-100';
    const descriptionColor = variant === 'dark' ? 'text-white/80' : 'text-gray-600 dark:text-gray-300';

    const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
        const link = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(link.clientWidth, link.clientHeight);
        const radius = diameter / 2;
        const rect = link.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple-effect");

        const oldRipple = link.querySelector(".ripple-effect");
        if (oldRipple) {
            oldRipple.remove();
        }

        link.appendChild(circle);

        setTimeout(() => {
            if (circle.parentElement) {
                circle.remove();
            }
        }, 600);
    };

    return (
        <Link 
            to={to} 
            className={`group block text-left mb-3 ripple-container rounded-lg py-2 -my-2 ${className}`}
            onClick={createRipple}
        >
            <h2 className={`inline-flex items-center text-2xl md:text-4xl font-serif font-bold ${titleColor} mb-3 group-hover:text-brand-accent transition-colors duration-300`}>
                <span>{title}</span>
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-300 block md:hidden" />
            </h2>
            <div className="hidden md:block w-24 h-1 bg-brand-accent rounded mr-auto group-hover:w-28 transition-all duration-300"></div>
            <p className={`hidden md:block text-left ${descriptionColor} mt-6 max-w-2xl`}>{description}</p>
        </Link>
    );
};

export default SectionHeader;
