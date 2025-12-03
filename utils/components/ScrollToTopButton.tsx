
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ArrowUpIcon from './icons/ArrowUpIcon';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const [isAppMode, setIsAppMode] = useState(false);

    // Check for App Mode status
    useEffect(() => {
        const checkMode = () => {
            const mode = localStorage.getItem('mobileViewMode');
            setIsAppMode(mode === 'app');
        };
        
        // Initial check
        checkMode();

        // Listen for changes
        window.addEventListener('mobileViewModeChanged', checkMode);
        return () => window.removeEventListener('mobileViewModeChanged', checkMode);
    }, []);

    // Toggle visibility based on scroll and context
    useEffect(() => {
        const toggleVisibility = () => {
            // Check if we are on the homepage (checking all language prefixes)
            const path = location.pathname.replace(/\/$/, '');
            const isHomePage = path === '/' || ['/mk', '/en', '/sr', '/el'].includes(path);

            // Completely hide button if on Homepage AND in App Mode
            if (isHomePage && isAppMode) {
                setIsVisible(false);
                return;
            }

            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        // Run once immediately to handle initial state/route change
        toggleVisibility();

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [location.pathname, isAppMode]);

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`
                scroll-to-top-button
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                fixed bottom-6 right-6 z-50
                bg-brand-accent text-white
                p-3 rounded-full shadow-lg
                hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-accent
                transition-all duration-300 ease-in-out
                transform hover:-translate-y-1
            `}
            aria-label="Scroll to top"
        >
            <ArrowUpIcon className="w-6 h-6" />
        </button>
    );
};

export default ScrollToTopButton;
