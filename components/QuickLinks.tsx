
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

// Icons
import BedIcon from './icons/BedIcon';
import UtensilsCrossedIcon from './icons/UtensilsCrossedIcon';
import StoreIcon from './icons/StoreIcon';
import CasinoChipIcon from './icons/CasinoChipIcon';
import CarIcon from './icons/CarIcon';
import TagIcon from './icons/TagIcon';
import MapTourIcon from './icons/MapTourIcon';
import GrapeIcon from './icons/GrapeIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import CameraIcon from './icons/CameraIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import CalendarIcon from './icons/CalendarIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';


const QuickLinkItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="flex flex-col items-center space-y-3 group/item text-center p-2 w-24 flex-shrink-0">
        <div className="w-20 h-20 bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm dark:ring-1 dark:ring-white/10 rounded-full flex items-center justify-center text-brand-blue group-hover/item:bg-brand-accent group-hover/item:text-white transition-all duration-300 transform group-hover/item:scale-110 shadow-md group-hover/item:shadow-lg group-hover/item:dark:shadow-brand-accent/30">
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-10 h-10" })}
        </div>
        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover/item:text-brand-accent transition-colors">{label}</span>
    </Link>
);

const DesktopCarousel: React.FC<{ title: string; links: { to: string; icon: React.ReactNode; label: string }[] }> = ({ title, links }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);

    const handleScroll = useCallback(() => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowPrev(scrollLeft > 10);
            setShowNext(scrollWidth - clientWidth - scrollLeft > 10);
        }
    }, []);
    
    const scroll = (direction: 'prev' | 'next') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth * 0.75;
            sliderRef.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            handleScroll();
            const resizeObserver = new ResizeObserver(handleScroll);
            resizeObserver.observe(slider);
            slider.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                resizeObserver.disconnect();
                slider.removeEventListener('scroll', handleScroll);
            };
        }
    }, [links, handleScroll]);

    return (
        <div className="relative group w-full">
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">{title}</h3>
            
            <div className="relative">
                {showPrev && (
                    <button 
                        onClick={() => scroll('prev')} 
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-brand-text dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all z-10 opacity-0 group-hover:opacity-100"
                        aria-label="Previous"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}

                <div ref={sliderRef} className="flex overflow-x-auto scroll-smooth hide-scrollbar -mx-4 px-4 snap-x snap-mandatory">
                    <div className="flex flex-nowrap gap-x-4">
                        {links.map(link => <QuickLinkItem key={link.to} {...link} />)}
                    </div>
                </div>

                {showNext && (
                    <button 
                        onClick={() => scroll('next')} 
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-brand-text dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all z-10 opacity-0 group-hover:opacity-100"
                        aria-label="Next"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};


const QuickLinks: React.FC = () => {
    const { t, getLocalizedPath } = useTranslation();
    const [activeTab, setActiveTab] = useState('main');

    const mainLinks = [
        { to: getLocalizedPath('/accommodation'), icon: <BedIcon />, label: t('nav.accommodation') },
        { to: getLocalizedPath('/restaurants'), icon: <UtensilsCrossedIcon />, label: t('nav.whereToEat') },
        { to: getLocalizedPath('/shopping'), icon: <StoreIcon />, label: t('nav.shoppingGuide') },
        { to: getLocalizedPath('/entertainment'), icon: <CasinoChipIcon />, label: t('nav.entertainment') },
        { to: getLocalizedPath('/special-offers'), icon: <TagIcon />, label: t('nav.specialOffers') },
        { to: getLocalizedPath('/pomos-na-pat'), icon: <CarIcon />, label: t('nav.roadsideAssistance') },
    ];
    
    const exploreLinks = [
        { to: getLocalizedPath('/attractions'), icon: <MapTourIcon />, label: t('nav.localAttractions') },
        { to: getLocalizedPath('/wine-paradise'), icon: <GrapeIcon />, label: t('nav.wineParadise') },
        { to: getLocalizedPath('/gvg-play'), icon: <VideoCameraIcon />, label: t('nav.videoMoments') },
        { to: getLocalizedPath('/photographers'), icon: <CameraIcon />, label: t('nav.photographersCorner') },
        { to: getLocalizedPath('/stories'), icon: <LightbulbIcon />, label: t('nav.stories') },
        { to: getLocalizedPath('/events'), icon: <CalendarIcon />, label: t('nav.events') },
    ];

    const TabButton: React.FC<{tabName: string; label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 px-4 py-3 text-sm font-bold transition-colors duration-200 border-b-2 ${
                activeTab === tabName
                    ? 'border-brand-accent text-brand-text dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-brand-text dark:hover:text-gray-100'
            }`}
        >
            {label}
        </button>
    );
    
    const linksToRender = activeTab === 'main' ? mainLinks : exploreLinks;

    return (
        <section className="bg-brand-bg-light dark:bg-gray-900 pt-4 pb-6 sm:pt-8 sm:pb-16 rounded-b-2xl sm:rounded-none">
            <div className="container mx-auto px-0 sm:px-6 lg:px-8">
                {/* Desktop Version (sm and up) */}
                <div className="hidden sm:grid sm:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-8 xl:gap-12">
                    <DesktopCarousel title={t('quickLinks.mainServices')} links={mainLinks} />
                    <div className="hidden xl:block w-px h-32 bg-gray-200 dark:bg-gray-700 self-center mt-8"></div>
                    <DesktopCarousel title={t('quickLinks.exploreMore')} links={exploreLinks} />
                </div>


                {/* Mobile Version (below sm) */}
                <div className="sm:hidden">
                    <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mx-4">
                        <TabButton tabName="main" label={t('quickLinks.mainServices')} />
                        <TabButton tabName="explore" label={t('quickLinks.exploreMore')} />
                    </div>
                    <div className="flex overflow-x-auto space-x-4 hide-scrollbar px-4 pt-6 pb-2">
                        {linksToRender.map(({ to, icon, label }) => (
                            <Link 
                                key={to}
                                to={to} 
                                className="flex flex-col items-center space-y-1.5 group text-center flex-shrink-0 w-16"
                            >
                                <div className="w-14 h-14 bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm dark:ring-1 dark:ring-white/10 rounded-full flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300 transform group-active:scale-95 shadow-sm">
                                    {React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7" })}
                                </div>
                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-300 w-full group-hover:text-brand-accent transition-colors">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickLinks;
