
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import ChevronRightIcon from './icons/ChevronRightIcon';
import CarIcon from './icons/CarIcon';
import MapPinIcon from './icons/MapPinIcon';
import CreditCardIcon from './icons/CreditCardIcon';

// A small icon to indicate an external link
const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3 ml-1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtext: string;
    link?: string;
    internalLink?: string;
    animate?: boolean;
    highlight?: boolean;
    hideArrow?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, subtext, link, internalLink, animate = false, highlight = false, hideArrow = false }) => {
    const [currentValue, setCurrentValue] = useState(() => animate ? 0 : parseFloat(value));
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        if (!animate) {
            return;
        }

        const numericEndValue = parseFloat(value);
        if (isNaN(numericEndValue)) {
            return;
        }

        let startTimestamp: number | null = null;
        const duration = 1200; // Animation duration in milliseconds

        const step = (timestamp: number) => {
            if (!startTimestamp) {
                startTimestamp = timestamp;
            }
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease-out cubic function for a smoother animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            setCurrentValue(easedProgress * numericEndValue);

            if (progress < 1) {
                animationFrameId.current = requestAnimationFrame(step);
            }
        };

        animationFrameId.current = requestAnimationFrame(step);

        return () => {
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [value, animate]);

    const displayContent = () => {
        if (!animate) {
            return value;
        }
        
        const numericEndValue = parseFloat(value);
        if (isNaN(numericEndValue)) {
            return value; // Return original string if not numeric
        }

        const unit = value.replace(/[\d.-]/g, '').trim();
        const hasDecimals = value.includes('.');
        const decimalPlaces = hasDecimals ? (value.split('.')[1] || '').split(' ')[0].length : 0;
        
        return `${currentValue.toFixed(decimalPlaces)} ${unit}`;
    };

    const Content = () => (
        <div className={`h-full w-full ${highlight ? 'sm:bg-brand-accent/5 sm:dark:bg-brand-accent/10 sm:rounded-xl sm:p-4 sm:transition-colors sm:duration-300 sm:group-hover:bg-brand-accent/10 sm:dark:group-hover:bg-brand-accent/20' : ''}`}>
            
            {/* --- DESKTOP LAYOUT (Unified) --- */}
            <div className="hidden sm:flex flex-col h-full text-left relative">
                {/* Header: Title and Icon Container */}
                <div className="flex items-start justify-between mb-6">
                    <h4 className={`text-xs font-extrabold uppercase tracking-widest mt-2 ${highlight ? 'text-brand-accent' : 'text-gray-400 dark:text-gray-500'}`}>
                        {title}
                    </h4>
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center text-brand-accent shrink-0 transition-transform group-hover:scale-110 group-hover:bg-brand-accent/10">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" }) : <span className="text-lg">{icon}</span>}
                    </div>
                </div>
                
                {/* Body: Value and Subtext */}
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center justify-start gap-2">
                        <p className="text-2xl font-black text-brand-text dark:text-white whitespace-nowrap tracking-tight leading-none">
                            {displayContent()}
                        </p>
                        {internalLink && !hideArrow && (
                            <div className="bg-brand-accent text-white rounded-full p-0.5 shadow-sm transform transition-transform duration-300 group-hover:translate-x-1">
                                <ChevronRightIcon className="w-3 h-3" />
                            </div>
                        )}
                        {link && <ExternalLinkIcon className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate w-full">{subtext}</p>
                </div>
            </div>

            {/* --- MOBILE LAYOUT (Symmetrical) --- */}
            <div className="sm:hidden flex flex-col items-center justify-start h-full pt-4 pb-10 gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 leading-none">{title}</h4>
                
                <div className="flex items-center justify-center gap-2">
                    <p className="text-xl font-bold text-brand-text dark:text-white whitespace-nowrap leading-none">
                        {displayContent()}
                    </p>
                    {internalLink && !hideArrow && (
                        <div className="bg-brand-accent text-white rounded-full p-0.5 shadow-sm">
                            <ChevronRightIcon className="w-2.5 h-2.5" />
                        </div>
                    )}
                    {link && <ExternalLinkIcon className="w-2.5 h-2.5 text-gray-400" />}
                </div>
            </div>
        </div>
    );

    // Render logic based on link type
    if (internalLink) {
        return (
            <Link to={internalLink} className="block h-full group bg-white dark:bg-gray-800/50 sm:p-5 rounded-xl shadow-sm cursor-pointer relative overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700 hover:ring-brand-accent/50 transition-all duration-300 w-full hover:shadow-md">
                <Content />
            </Link>
        );
    }

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full group bg-white dark:bg-gray-800/50 sm:p-5 rounded-xl shadow-sm cursor-pointer relative overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700 hover:ring-brand-accent/50 transition-all duration-300 w-full hover:shadow-md">
                <Content />
            </a>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800/50 sm:p-5 rounded-xl shadow-sm h-full w-full border border-transparent dark:border-gray-700">
            <Content />
        </div>
    );
};


const InfoPanel: React.FC = () => {
    const { t, getLocalizedPath } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const infoItems = [
        { 
            icon: <MapPinIcon />, 
            title: t('homepage.infoPanel.border'), 
            value: t('homepage.infoPanel.borderStatus'), 
            subtext: t('homepage.infoPanel.borderCrossing'),
            link: "https://amsm.mk/soobrakaj/sostojba-na-patistata/"
        },
        { 
            icon: <CarIcon />, 
            title: t('nav.gasStations'), 
            value: t('homepage.infoPanel.autoServicesValue'), 
            subtext: t('homepage.infoPanel.autoServicesSubtext'),
            internalLink: getLocalizedPath("/gas-stations"),
            animate: false,
            highlight: false, 
            hideArrow: true
        },
        { 
            icon: <CreditCardIcon />, 
            title: t('homepage.infoPanel.currency'), 
            value: "61.6 ден.", 
            subtext: t('homepage.infoPanel.currencyRate'),
            animate: true
        },
    ];

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const width = scrollRef.current.clientWidth;
            const newIndex = Math.round(scrollLeft / width);
            setActiveIndex(newIndex);
        }
    };
    
    return (
        <section className="bg-brand-bg-light dark:bg-gray-900 pt-2 pb-4 sm:pt-12 sm:pb-8 rounded-t-2xl sm:rounded-none">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Desktop Grid View (Hidden on Mobile) */}
                <div className="hidden sm:grid grid-cols-3 gap-6">
                    {infoItems.map((item, index) => (
                        <div key={index} className="h-full">
                            <InfoCard {...item} />
                        </div>
                    ))}
                </div>

                {/* Mobile Slider View (Visible on Mobile) */}
                <div className="sm:hidden relative">
                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                        onScroll={handleScroll}
                    >
                        {infoItems.map((item, index) => (
                            <div key={index} className="min-w-full snap-center px-0.5">
                                <InfoCard {...item} />
                            </div>
                        ))}
                    </div>
                    
                    {/* Integrated Dots Indicator */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                        {infoItems.map((_, index) => (
                            <div 
                                key={index} 
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    index === activeIndex 
                                    ? 'w-3 bg-brand-accent' 
                                    : 'w-1 bg-gray-300 dark:bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default InfoPanel;
