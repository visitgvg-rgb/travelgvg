
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import ClockIcon from '../components/icons/ClockIcon';
import SlotMachineIcon from '../components/icons/SlotMachineIcon';
import CasinoChipIcon from '../components/icons/CasinoChipIcon';
import MusicNoteIcon from '../components/icons/MusicNoteIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../i18n';
import type { Restaurant as ZabavaItem, Listing, MultiLangString, Banner as BannerType } from '../types';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import ToggleSwitch from '../components/ToggleSwitch';
import Banner from '../components/Banner';
import { sortAndShuffleListings } from '../utils/helpers';
import { useFavorites } from '../context/FavoritesContext';
import HeartIcon from '../components/icons/HeartIcon';
import SEO from '../components/SEO';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

const isVenueOpen = (workingHours: string | undefined): boolean => {
    if (!workingHours) return true; // Fail-safe: if no hours, show it

    const normalized = workingHours.toLowerCase().trim();
    if (normalized === '24/7' || normalized.includes('24/7')) return true;

    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sun) - 6 (Sat)
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Helper to parse day names (3 chars is enough for unique id in mk/en/sr/el)
    const dayMap: { [key: string]: number } = {
        'mon': 1, 'pon': 1, 'пон': 1, 'deu': 1, 'δευ': 1,
        'tue': 2, 'uto': 2, 'вто': 2, 'tri': 2, 'τρι': 2,
        'wed': 3, 'sre': 3, 'сре': 3, 'tet': 3, 'τετ': 3,
        'thu': 4, 'cet': 4, 'чет': 4, 'pem': 4, 'πεμ': 4,
        'fri': 5, 'pet': 5, 'пет': 5, 'par': 5, 'παρ': 5,
        'sat': 6, 'sub': 6, 'саб': 6, 'sav': 6, 'σαβ': 6,
        'sun': 0, 'ned': 0, 'нед': 0, 'kyr': 0, 'κυρ': 0
    };

    const getDayIndex = (str: string) => {
        const clean = str.trim().substring(0, 3);
        return dayMap[clean];
    };

    // Split multiple lines (e.g. "Mon-Fri: 09-17 \n Sat: 10-14")
    const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);
    
    let activeTimeRange: string | null = null;

    for (const line of lines) {
        // Split by first colon to separate Days from Time
        const colonIndex = line.indexOf(':');
        
        // If no colon, or colon is part of time (e.g. starts with digit), treat as generic rule
        if (/^\d/.test(line)) {
            activeTimeRange = line;
            break; // Found a generic rule
        }

        if (colonIndex > -1) {
            const daysPart = line.substring(0, colonIndex).trim();
            const timePart = line.substring(colonIndex + 1).trim();

            // Check for Range (e.g. Mon-Fri)
            if (daysPart.includes('-')) {
                const [startStr, endStr] = daysPart.split('-');
                const startDay = getDayIndex(startStr);
                const endDay = getDayIndex(endStr);

                if (startDay !== undefined && endDay !== undefined) {
                    // Standard range: 1-5 (Mon-Fri)
                    if (startDay <= endDay) {
                        if (currentDay >= startDay && currentDay <= endDay) {
                            activeTimeRange = timePart;
                            break;
                        }
                    } 
                    // Wrap range: 6-1 (Sat-Mon)
                    else {
                        if (currentDay >= startDay || currentDay <= endDay) {
                            activeTimeRange = timePart;
                            break;
                        }
                    }
                }
            } 
            // Single Day (e.g. Sunday)
            else {
                const dayIndex = getDayIndex(daysPart);
                if (dayIndex !== undefined && dayIndex === currentDay) {
                    activeTimeRange = timePart;
                    break;
                }
            }
        }
    }

    // If no specific day matched, and we didn't find a generic line yet, 
    // we assume false (Closed), unless the loop missed a generic line.
    
    if (!activeTimeRange) return false;

    // Parse Time Range: "12:00 - 01:00"
    const timeRegex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
    const match = activeTimeRange.match(timeRegex);
    
    if (!match) return false;

    const startVal = parseInt(match[1], 10) * 100 + parseInt(match[2], 10);
    const endVal = parseInt(match[3], 10) * 100 + parseInt(match[4], 10);

    if (endVal < startVal) { // Overnight shift
        return currentTime >= startVal || currentTime < endVal;
    } else { // Standard shift
        return currentTime >= startVal && currentTime < endVal;
    }
};


const EntertainmentPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const lang = language as keyof MultiLangString;

    const [zabavaListings, setZabavaListings] = useState<ZabavaItem[]>([]);
    const [shuffledZabavaListings, setShuffledZabavaListings] = useState<ZabavaItem[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [bannerLoading, setBannerLoading] = useState(true);
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const filters = [t('filters.all'), t('filters.casinos'), t('filters.bars'), t('filters.cafeBars'), t('filters.clubs')];

    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.casinos')]: "kazina",
        [t('filters.bars')]: "barovi",
        [t('filters.cafeBars')]: "kafe-barovi",
        [t('filters.clubs')]: "klubovi",
    };

    useEffect(() => {
        const fetchZabavaData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/zabava.json');
                const data: ZabavaItem[] = await response.json();
                
                setZabavaListings(data);
                setShuffledZabavaListings(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch zabava data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchZabavaData();
    }, []);

    useEffect(() => {
        const fetchBanners = async () => {
            setBannerLoading(true);
            try {
                const res = await fetch('/data/banners.json');
                if (!res.ok) throw new Error('Failed to fetch banners');
                const data: BannerType[] = await res.json();
                setBanners(data);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setBannerLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const displayedZabavaListings = useMemo(() => {
        let baseFilteredItems: ZabavaItem[];
    
        // 1. Filter by category
        if (activeFilter === t('filters.all')) {
            baseFilteredItems = [...shuffledZabavaListings];
        } else {
            const categoryToFilter = filterCategoryMap[activeFilter];
            baseFilteredItems = shuffledZabavaListings.filter(item => item.category === categoryToFilter);
        }
        
        // 2. Filter by "Open Now"
        if (showOpenOnly) {
            baseFilteredItems = baseFilteredItems.filter(item => isVenueOpen(item.details?.working_hours?.[lang]));
        }
        
        return baseFilteredItems;
    
    }, [shuffledZabavaListings, activeFilter, showOpenOnly, t, filterCategoryMap, lang]);

    useEffect(() => {
        setActiveFilter(t('filters.all'));
    }, [t]);

    useEffect(() => {
        if (zabavaListings.length === 0) return;

        const params = new URLSearchParams(location.search);
        const itemId = params.get('open');

        if (itemId) {
            const itemToOpen = zabavaListings.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
                navigate(location.pathname, { replace: true });
            }
        }
    }, [zabavaListings, location.search, navigate]);
    
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };
    
    const handleCardClick = (item: Listing) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (isFavorite(id)) {
            removeFavorite(id);
        } else {
            addFavorite(id);
        }
    };

    const FeatureIcons: React.FC<{ item: ZabavaItem }> = ({ item }) => {
        const hasFeatures = item.features && item.features.length > 0;

        return (
            <div className="pt-4 border-t border-white/20">
                {hasFeatures ? (
                    <div className="flex items-center justify-end space-x-4 h-5">
                        {item.features.includes('24-7') && (
                            <div className="flex items-center space-x-1.5" title={t('features.24-7')}>
                                <ClockIcon className="w-5 h-5" />
                                <span className="text-xs font-semibold">{t('features.24-7')}</span>
                            </div>
                        )}
                        {item.features.includes('slot-masini') && (
                            <div className="flex items-center space-x-1.5" title={t('features.slot-masini')}>
                                <SlotMachineIcon className="w-5 h-5" />
                                <span className="text-xs font-semibold">{t('features.slot-masini')}</span>
                            </div>
                        )}
                        {item.features.includes('igri-vo-zivo') && (
                            <div className="flex items-center space-x-1.5" title={t('features.igri-vo-zivo')}>
                                <CasinoChipIcon className="w-5 h-5" />
                                <span className="text-xs font-semibold">{t('features.igri-vo-zivo')}</span>
                            </div>
                        )}
                        {item.features.includes('muzika-vo-zivo') && (
                            <div className="flex items-center space-x-1.5" title={t('features.muzika-vo-zivo')}>
                                <MusicNoteIcon className="w-5 h-5" />
                                <span className="text-xs font-semibold">{t('features.muzika-vo-zivo')}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-5" /> // A placeholder to maintain consistent height
                )}
            </div>
        );
    };

    const activeEntertainmentBanner = useMemo(() => banners.find(banner => {
        if (!banner.placement.includes('entertainment-list-top') || !banner.config.isActive) {
            return false;
        }
        if (!banner.config.targetCategory || activeFilter === t('filters.all')) {
            return true;
        }
        const categoryToFilter = filterCategoryMap[activeFilter];
        return banner.config.targetCategory === categoryToFilter;
    }), [banners, activeFilter, t, filterCategoryMap]);

    return (
        <>
            <SEO title={t('seo.entertainment')} description={t('homepage.entertainmentDesc')} />
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4 pb-10">
                {/* Mobile Collapsible Title & Info */}
                <div className="text-left mb-4 md:mb-8">
                    <button 
                        onClick={() => setIsInfoOpen(!isInfoOpen)}
                        className="w-full flex items-center justify-start gap-2 group outline-none select-none md:cursor-default"
                        aria-expanded={isInfoOpen}
                    >
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100 text-left">
                            {t('entertainmentPage.title')}
                        </h1>
                        <ChevronDownIcon 
                            className={`w-6 h-6 text-brand-text dark:text-white transition-transform duration-300 md:hidden ${isInfoOpen ? 'rotate-180' : ''}`} 
                        />
                    </button>
                </div>

                <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out md:max-h-none md:opacity-100
                    ${isInfoOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'} md:mb-10`}
                >
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-rose-200/50 dark:border-rose-500/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 p-6">
                            {/* Main Info */}
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="hidden md:block flex-shrink-0 bg-rose-100 dark:bg-rose-900/50 p-3 rounded-full">
                                    <CasinoChipIcon className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('entertainmentPage.infoBoxTitle')}</h3>
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('entertainmentPage.infoBoxDesc')}</p>
                                </div>
                            </div>

                            {/* Desktop Pro-Tip (Hidden on Mobile) */}
                            <div className="hidden md:block flex-shrink-0 w-full md:w-auto md:max-w-xs lg:max-w-sm">
                                <div className="bg-white/50 dark:bg-gray-800/50 border border-rose-100 dark:border-rose-500/20 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <LightbulbIcon className="w-6 h-6 text-rose-500 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('entertainmentPage.proTipTitle')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('entertainmentPage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                     {/* --- Desktop View --- */}
                    <div className="hidden sm:flex items-center justify-between p-2">
                        <div className="flex-grow">
                            <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                        </div>
                        <div className="flex-shrink-0 pr-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <ToggleSwitch
                                id="open-now-desktop"
                                label={t('entertainmentPage.openNow')}
                                checked={showOpenOnly}
                                onChange={setShowOpenOnly}
                            />
                        </div>
                    </div>

                    {/* --- Mobile View --- */}
                    <div className="sm:hidden">
                        <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 mx-4"></div>
                        <div className="px-4 pb-2 flex justify-start">
                            <ToggleSwitch
                                id="open-now-mobile"
                                label={t('entertainmentPage.openNow')}
                                checked={showOpenOnly}
                                onChange={setShowOpenOnly}
                            />
                        </div>
                    </div>
                </div>

                {bannerLoading ? (
                    <div className="my-8 md:my-12">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl aspect-[4/3] md:aspect-[3/1]"></div>
                    </div>
                ) : activeEntertainmentBanner && (
                    <Banner banner={activeEntertainmentBanner} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                             <div key={i} className="relative rounded-lg shadow-lg overflow-hidden h-96 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                        ))
                    ) : (
                        displayedZabavaListings.map(item => {
                            const highlightText = item.highlight?.[lang];
                            const thisItemIsFavorite = isFavorite(item.id);
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => handleCardClick(item)}
                                    className="relative rounded-lg shadow-lg overflow-hidden cursor-pointer group h-96 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                                >
                                    <img 
                                        src={item.images[0]} 
                                        alt={item.title[lang]} 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" 
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    
                                    <button 
                                        onClick={(e) => handleFavoriteClick(e, item.id)} 
                                        className="absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors" 
                                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                                    >
                                        <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                                    </button>

                                    {highlightText && (
                                        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
                                            <div className="absolute transform -rotate-45 bg-purple-600 text-white text-xs font-bold text-center uppercase py-1 shadow-md w-[170px] left-[-35px] top-[32px]">
                                                {highlightText}
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                                    
                                    <div className="relative p-5 flex flex-col justify-end h-full text-white">
                                        <div className="flex-grow"></div>
                                        <p className="text-white/80 text-sm line-clamp-2 mb-4 drop-shadow-sm">{item.description[lang]}</p>
                                        <h3 className="text-xl font-serif font-bold mb-2 drop-shadow-md">{item.title[lang]}</h3>
                                        <FeatureIcons item={item} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                { !loading && displayedZabavaListings.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('entertainmentPage.noResults')}</p>
                    </div>
                )}

                <Modal item={selectedItem} onClose={handleCloseModal} />
            </div>
        </>
    );
};

export default EntertainmentPage;
