
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';

// Main Icons
import ChevronDownIcon from './icons/ChevronDownIcon';
import SearchIcon from './icons/SearchIcon';

// Mobile & Mega Menu Icons
import BedIcon from './icons/BedIcon';
import UtensilsCrossedIcon from './icons/UtensilsCrossedIcon';
import StoreIcon from './icons/StoreIcon';
import CasinoChipIcon from './icons/CasinoChipIcon';
import TagIcon from './icons/TagIcon';
import MapTourIcon from './icons/MapTourIcon';
import GrapeIcon from './icons/GrapeIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import CalendarIcon from './icons/CalendarIcon';
import CarIcon from './icons/CarIcon';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import HeartIcon from './icons/HeartIcon';
import { useFavorites } from '../context/FavoritesContext';
import CameraIcon from './icons/CameraIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import SearchModal from './SearchModal';
import GasPumpIcon from './icons/GasPumpIcon';


const CloseIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MobileNavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick: () => void }> = ({ to, icon, label, onClick }) => (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `flex items-center space-x-4 p-3 rounded-lg text-lg transition-colors duration-200 ${isActive ? 'bg-brand-accent/10 text-brand-accent font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
        {icon}
        <span>{label}</span>
    </NavLink>
);

const MegaMenuLink: React.FC<{ to: string, icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({ to, icon, title, description, onClick }) => (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `flex items-start p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-brand-accent/10 text-brand-accent' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-brand-text dark:text-gray-200'}`}>
        <div className="flex-shrink-0 mt-1 mr-4 text-brand-accent">{icon}</div>
        <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    </NavLink>
);

const LanguageSwitcher: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { language, changeLanguage } = useTranslation();
    const languages = ['mk', 'en', 'sr', 'el'];
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languageFlags: { [key: string]: string } = {
        mk: '🇲🇰',
        en: '🇬🇧',
        sr: '🇷🇸',
        el: '🇬🇷',
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isMobile) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 text-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <span>{languageFlags[language]}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-20 animate-zoom-slide-up">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        changeLanguage(lang);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${language === lang ? 'bg-gray-100 dark:bg-gray-700 text-brand-accent font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                    role="menuitem"
                                >
                                    <span className="text-lg">{languageFlags[lang]}</span>
                                    <span>{lang.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1 text-sm font-semibold">
             {languages.map(lang => (
                <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1 rounded-full transition-colors ${language === lang ? 'bg-white dark:bg-gray-600 text-brand-accent shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'}`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

const ThemeToggle: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
    const { theme, toggleTheme } = useTheme();
    const buttonClass = isMobile 
      ? "text-brand-text dark:text-gray-200 p-2" 
      : "text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent transition-colors py-2 group";

    return (
      <button onClick={toggleTheme} className={buttonClass} aria-label="Toggle theme">
        {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6 text-brand-yellow" />}
        {!isMobile && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>}
      </button>
    );
};

const Header: React.FC = () => {
    const { t, language, getLocalizedPath } = useTranslation();
    const { favoritesCount } = useFavorites();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const exploreMenuRef = useRef<HTMLDivElement>(null);

    const [isAppMode, setIsAppMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('mobileViewMode');
        return savedMode === 'app';
    });

    // Check if current path matches standard home pattern /mk, /en etc.
    const isHomePage = location.pathname === `/${language}`;
    const shouldHideHamburger = isHomePage && isAppMode;

    const explorePages = ['/attractions', '/wine-paradise', '/stories', '/events', '/photographers', '/gvg-play', '/pomos-na-pat', '/gas-stations'];
    const isExploreActive = explorePages.some(path => location.pathname.includes(path));

    const searchPlaceholder: { [key: string]: string } = {
        mk: "Пребарај тука...",
        en: "Search here...",
        sr: "Pretraži ovde...",
        el: "Αναζήτηση εδώ..."
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAppMode(localStorage.getItem('mobileViewMode') === 'app');
        };
        window.addEventListener('mobileViewModeChanged', handleStorageChange);
        handleStorageChange();
        return () => {
            window.removeEventListener('mobileViewModeChanged', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsExploreMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                setIsExploreMenuOpen(false);
            }
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target as Node)) {
                setIsExploreMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinkClasses = (isActive: boolean) =>
    `py-2 font-semibold border-b-2 transition-colors duration-300 ${
      isActive
        ? 'text-brand-accent font-bold border-brand-accent'
        : 'text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent border-transparent'
    }`;


    return (
        <>
            <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-md dark:shadow-black/20 z-30 transition-all duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to={getLocalizedPath('/')} onClick={() => isHomePage && window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1.5">
                                <SunIcon className="w-8 h-8 text-brand-yellow" />
                                <div className="flex items-baseline">
                                  <span className="text-2xl font-sans font-normal text-brand-blue dark:text-gray-200 tracking-tight">Travel</span>
                                  <span className="text-2xl font-serif font-extrabold text-brand-accent tracking-tighter">GVG</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
                            <NavLink to={getLocalizedPath('/accommodation')} className={({isActive}) => navLinkClasses(isActive)}>{t('nav.accommodation')}</NavLink>
                            <NavLink to={getLocalizedPath('/restaurants')} className={({isActive}) => navLinkClasses(isActive)}>{t('nav.whereToEat')}</NavLink>
                            <NavLink to={getLocalizedPath('/shopping')} className={({isActive}) => navLinkClasses(isActive)}>{t('nav.shoppingGuide')}</NavLink>
                            <NavLink to={getLocalizedPath('/entertainment')} className={({isActive}) => navLinkClasses(isActive)}>{t('nav.entertainment')}</NavLink>
                            <NavLink to={getLocalizedPath('/special-offers')} className={({isActive}) => navLinkClasses(isActive)}>{t('nav.specialOffers')}</NavLink>
                            
                            <div className="relative" ref={exploreMenuRef}>
                                <button
                                    onClick={() => setIsExploreMenuOpen(!isExploreMenuOpen)}
                                    className={`${navLinkClasses(isExploreActive)} flex items-center gap-1`}
                                    aria-expanded={isExploreMenuOpen}
                                >
                                    {t('nav.explore')}
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExploreMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isExploreMenuOpen && (
                                    <div
                                        onMouseLeave={() => setIsExploreMenuOpen(false)}
                                        className="absolute top-full right-0 mt-4 w-[26rem] bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black dark:ring-gray-700 ring-opacity-5 p-4 z-10 animate-zoom-slide-up"
                                    >
                                        <div className="grid grid-cols-1 gap-2">
                                           <MegaMenuLink to={getLocalizedPath('/attractions')} icon={<MapTourIcon className="w-6 h-6"/>} title={t('nav.localAttractions')} description={t('nav.localAttractionsDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                           <MegaMenuLink to={getLocalizedPath('/wine-paradise')} icon={<GrapeIcon className="w-6 h-6"/>} title={t('nav.wineParadise')} description={t('nav.wineParadiseDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                           <MegaMenuLink to={getLocalizedPath('/stories')} icon={<LightbulbIcon className="w-6 h-6"/>} title={t('nav.stories')} description={t('nav.storiesDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                           <MegaMenuLink to={getLocalizedPath('/events')} icon={<CalendarIcon className="w-6 h-6"/>} title={t('nav.events')} description={t('nav.eventsDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                           <MegaMenuLink to={getLocalizedPath('/gvg-play')} icon={<VideoCameraIcon className="w-6 h-6"/>} title={t('nav.videoMoments')} description={t('nav.videoMomentsDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                           <MegaMenuLink to={getLocalizedPath('/photographers')} icon={<CameraIcon className="w-6 h-6"/>} title={t('nav.photographersCorner')} description={t('nav.photographersCornerDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                           
                                           <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                           
                                           <MegaMenuLink to={getLocalizedPath('/pomos-na-pat')} icon={<CarIcon className="w-6 h-6"/>} title={t('nav.roadsideAssistance')} description={t('pomosNaPatSubtitle')} onClick={() => setIsExploreMenuOpen(false)} />
                                           <MegaMenuLink to={getLocalizedPath('/gas-stations')} icon={<GasPumpIcon className="w-6 h-6"/>} title={t('nav.gasStations')} description={t('gasStationsPage.infoBoxDesc')} onClick={() => setIsExploreMenuOpen(false)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-5">
                             <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent transition-colors py-2 group"
                                aria-label="Search"
                             >
                                <SearchIcon className="w-6 h-6" />
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                             </button>

                             <NavLink to={getLocalizedPath('/favorites')} className="relative text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent transition-colors py-2 group" aria-label={t('nav.favorites')}>
                                <HeartIcon className="w-6 h-6" />
                                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${location.pathname.includes('/favorites') ? 'scale-x-100' : ''}`}></div>
                                {favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-2.5 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {favoritesCount}
                                    </span>
                                )}
                            </NavLink>
                            <ThemeToggle />
                            <LanguageSwitcher />
                        </div>


                        {/* Mobile Controls */}
                        <div className="md:hidden flex items-center space-x-1">
                            {shouldHideHamburger && (
                                <button 
                                    onClick={() => setIsSearchOpen(true)}
                                    className="relative text-brand-text dark:text-gray-200 p-2"
                                    aria-label="Search"
                                >
                                    <SearchIcon className="w-6 h-6" />
                                </button>
                            )}

                            <NavLink to={getLocalizedPath('/favorites')} className="relative text-brand-text dark:text-gray-200 p-2" aria-label={t('nav.favorites')}>
                                <HeartIcon className="w-6 h-6" />
                                {favoritesCount > 0 && (
                                    <span className="absolute top-1 right-0 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {favoritesCount}
                                    </span>
                                )}
                            </NavLink>
                            <ThemeToggle isMobile />
                            <LanguageSwitcher isMobile />
                            
                            {!shouldHideHamburger && (
                                <button onClick={() => setIsMenuOpen(true)} className="text-brand-text dark:text-gray-200 p-2 -mr-2" aria-label="Open menu">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Floating Search Pill - Visible on inner pages only - MOVED TO BOTTOM LEFT */}
            {!shouldHideHamburger && !isHomePage && (
                <div className="md:hidden fixed bottom-6 left-6 z-40 animate-fade-in-slide-up pointer-events-none">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="pointer-events-auto flex items-center space-x-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-5 py-3 text-brand-text dark:text-gray-100 active:scale-95 transition-all duration-300"
                    >
                        <SearchIcon className="w-5 h-5 text-brand-accent" />
                        <span className="font-bold text-sm tracking-wide">{searchPlaceholder[language as keyof typeof searchPlaceholder] || 'Search'}</span>
                    </button>
                </div>
            )}

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {isMenuOpen && (
                <div role="dialog" aria-modal="true" className="md:hidden">
                    <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in-fast"></div>
                    <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col animate-slide-in-right">
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <Link to={getLocalizedPath('/')} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-1.5">
                                <SunIcon className="w-8 h-8 text-brand-yellow" />
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-sans font-normal text-brand-blue dark:text-gray-200 tracking-tight">Travel</span>
                                    <span className="text-2xl font-serif font-extrabold text-brand-accent tracking-tighter">GVG</span>
                                </div>
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-accent" aria-label="Close menu">
                                <CloseIcon />
                            </button>
                        </div>
                        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                           <MobileNavItem to={getLocalizedPath('/accommodation')} icon={<BedIcon className="w-6 h-6" />} label={t('nav.accommodation')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/restaurants')} icon={<UtensilsCrossedIcon className="w-6 h-6" />} label={t('nav.whereToEat')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/shopping')} icon={<StoreIcon className="w-6 h-6" />} label={t('nav.shoppingGuide')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/entertainment')} icon={<CasinoChipIcon className="w-6 h-6" />} label={t('nav.entertainment')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/special-offers')} icon={<TagIcon className="w-6 h-6" />} label={t('nav.specialOffers')} onClick={() => setIsMenuOpen(false)} />
                           
                           <hr className="my-4 border-gray-200 dark:border-gray-700"/>
                           
                           <p className="px-3 pt-2 pb-1 text-sm font-bold text-gray-400 uppercase">{t('nav.explore')}</p>
                           <MobileNavItem to={getLocalizedPath('/attractions')} icon={<MapTourIcon className="w-6 h-6" />} label={t('nav.localAttractions')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/wine-paradise')} icon={<GrapeIcon className="w-6 h-6" />} label={t('nav.wineParadise')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/stories')} icon={<LightbulbIcon className="w-6 h-6" />} label={t('nav.stories')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/events')} icon={<CalendarIcon className="w-6 h-6" />} label={t('nav.events')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/gvg-play')} icon={<VideoCameraIcon className="w-6 h-6" />} label={t('nav.videoMoments')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/photographers')} icon={<CameraIcon className="w-6 h-6" />} label={t('nav.photographersCorner')} onClick={() => setIsMenuOpen(false)} />

                           <hr className="my-4 border-gray-200 dark:border-gray-700"/>
                           
                           <MobileNavItem to={getLocalizedPath('/pomos-na-pat')} icon={<CarIcon className="w-6 h-6" />} label={t('nav.roadsideAssistance')} onClick={() => setIsMenuOpen(false)} />
                           <MobileNavItem to={getLocalizedPath('/gas-stations')} icon={<GasPumpIcon className="w-6 h-6" />} label={t('nav.gasStations')} onClick={() => setIsMenuOpen(false)} />
                        </nav>
                        <div className="p-4 border-t dark:border-gray-700">
                             <div className="flex justify-center space-x-6">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 dark:text-gray-400 hover:text-brand-accent transition-colors">
                                    <FacebookIcon className="w-7 h-7" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-brand-accent transition-colors">
                                    <InstagramIcon className="w-7 h-7" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
