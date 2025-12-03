
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AccommodationCard from '../components/AccommodationCard';
import Modal from '../components/Modal';
import SkeletonAccommodationCard from '../components/SkeletonAccommodationCard';
import SparklesIcon from '../components/icons/SparklesIcon';
import FilterIcon from '../components/icons/FilterIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import type { Accommodation, Listing, MultiLangString, Banner as BannerType } from '../types';
import { useTranslation } from '../i18n';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import Banner from '../components/Banner';
import { sortAndShuffleListings } from '../utils/helpers';
import SEO from '../components/SEO';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

const FILTER_CATEGORY_MAP: { [key: string]: string } = {
    "hotels": "hoteli",
    "apartments": "apartmani",
    "studios": "studija",
    "villas": "vili",
    "rooms": "sobi"
};

const PREDEFINED_AMENITIES = [
    "parking", "private_bathroom", "air_conditioning", "wifi", "pool", 
    "spa_center", "tv_flat_screen", "pets_allowed", "family_rooms", 
    "free_parking", "kitchen", "non_smoking_rooms", "balcony_terrace"
];

const AccommodationPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [shuffledAccommodations, setShuffledAccommodations] = useState<Accommodation[]>([]);
    const [activeFilterKey, setActiveFilterKey] = useState('all');
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('recommended');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [bannerLoading, setBannerLoading] = useState(true);

    const filters = useMemo(() => {
        const keys = ['all', 'hotels', 'apartments', 'studios', 'villas', 'rooms'];
        return keys.map(key => ({ key, label: t(`filters.${key}`) }));
    }, [t]);

    useEffect(() => {
        const fetchAccommodations = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/accommodation.json');
                const data: Accommodation[] = await response.json();
                setAccommodations(data); 
                setShuffledAccommodations(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch accommodation data:", error);
            } finally {
                setLoading(false);
            }
        };

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

        fetchAccommodations();
        fetchBanners();
    }, []);

    // Sync URL params with modal state
    useEffect(() => {
        if (accommodations.length === 0) return;
    
        const itemId = searchParams.get('open');
    
        if (itemId) {
            const itemToOpen = accommodations.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
            }
        } else {
            setSelectedItem(null);
        }
    }, [accommodations, searchParams]);
    
    const allAmenities = useMemo(() => {
        if (accommodations.length === 0) return [];
        
        const amenitiesSet = new Set<string>();
        accommodations.forEach(acc => {
            acc.amenities.forEach(amenity => amenitiesSet.add(amenity));
        });

        return [...new Set([...PREDEFINED_AMENITIES, ...Array.from(amenitiesSet)])]
            .filter(amenity => amenitiesSet.has(amenity) || PREDEFINED_AMENITIES.includes(amenity))
            .sort();
    }, [accommodations]);

    const displayedAccommodations = useMemo(() => {
        let filteredItems: Accommodation[];

        if (activeFilterKey === 'all') {
            filteredItems = [...accommodations];
        } else {
            const categoryToFilter = FILTER_CATEGORY_MAP[activeFilterKey];
            filteredItems = accommodations.filter(item => item.category === categoryToFilter);
        }
        
        if (selectedAmenities.length > 0) {
            filteredItems = filteredItems.filter(item => 
                selectedAmenities.every(amenity => item.amenities.includes(amenity))
            );
        }

        switch(sortOrder) {
            case 'rating':
                return [...filteredItems].sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0));
            case 'price_asc':
                return [...filteredItems].sort((a, b) => (a.priceFrom?.[lang] || Infinity) - (b.priceFrom?.[lang] || Infinity));
            case 'price_desc':
                return [...filteredItems].sort((a, b) => (b.priceFrom?.[lang] || -Infinity) - (a.priceFrom?.[lang] || -Infinity));
            case 'recommended':
            default:
                const shuffledIds = shuffledAccommodations.map(item => item.id);
                return [...filteredItems].sort((a, b) => shuffledIds.indexOf(a.id) - shuffledIds.indexOf(b.id));
        }
    }, [accommodations, shuffledAccommodations, activeFilterKey, selectedAmenities, sortOrder, lang]);

    const handleFilterChange = (label: string) => {
        const newFilter = filters.find(f => f.label === label);
        if (newFilter) setActiveFilterKey(newFilter.key);
    };

    const handleAmenityChange = (amenityKey: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenityKey) 
                ? prev.filter(a => a !== amenityKey)
                : [...prev, amenityKey]
        );
    };
    
    const handleCardClick = (item: Listing) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('open', item.id);
            return newParams;
        });
    };

    const handleCloseModal = () => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('open');
            return newParams;
        });
    };
    
    const activeFilterLabel = filters.find(f => f.key === activeFilterKey)?.label || '';

    const activeAccommodationBanner = useMemo(() => banners.find(banner => {
        if (!banner.placement.includes('accommodation-list-top') || !banner.config.isActive) return false;
        
        if (!banner.config.targetCategory || activeFilterKey === 'all') return true;
        
        const categoryToFilter = FILTER_CATEGORY_MAP[activeFilterKey];
        return banner.config.targetCategory === categoryToFilter;
    }), [banners, activeFilterKey]);

    return (
        <>
            <SEO 
                title={t('accommodationPage.title')} 
                description={t('homepage.accommodationDesc')} 
            />
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
                            {t('accommodationPage.title')}
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
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-orange-200/50 dark:border-orange-500/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 p-6">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="hidden md:block flex-shrink-0 bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
                                    <SparklesIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('accommodationPage.infoBoxTitle')}</h3>
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('accommodationPage.infoBoxDesc')}</p>
                                </div>
                            </div>
                            <div className="hidden md:block flex-shrink-0 w-full md:w-auto md:max-w-xs lg:max-w-sm">
                                <div className="bg-white/50 dark:bg-gray-800/50 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <LightbulbIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('accommodationPage.proTipTitle')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('accommodationPage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="filter-controls" className="mb-4">
                    {/* Mobile View */}
                    <div className="sm:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2">
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className="flex items-center space-x-2 p-2">
                                {filters.map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => handleFilterChange(f.label)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                                            activeFilterLabel === f.label
                                                ? 'bg-brand-accent text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 mx-2"></div>
                        <div className="flex items-center justify-between p-2">
                            <button 
                                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 relative"
                            >
                                <FilterIcon className="w-5 h-5" />
                                <span>{t('accommodationPage.amenities')}</span>
                                {selectedAmenities.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {selectedAmenities.length}
                                    </span>
                                )}
                            </button>
                            <div className="relative">
                                <select 
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-brand-accent py-2 pl-3 pr-8 cursor-pointer transition-colors"
                                >
                                    <option value="recommended">{t('accommodationPage.sortRecommended')}</option>
                                    <option value="rating">{t('accommodationPage.sortRating')}</option>
                                    <option value="price_asc">{t('accommodationPage.sortPriceAsc')}</option>
                                    <option value="price_desc">{t('accommodationPage.sortPriceDesc')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden sm:flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg dark:border dark:border-gray-700">
                        <div className="flex-grow overflow-x-auto hide-scrollbar border-r border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2 p-4">
                                {filters.map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => handleFilterChange(f.label)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                                            activeFilterLabel === f.label
                                                ? 'bg-brand-accent text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2 px-4">
                            <button 
                                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 relative"
                            >
                                <FilterIcon className="w-5 h-5" />
                                <span className="hidden md:inline">{t('accommodationPage.amenities')}</span>
                                {selectedAmenities.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {selectedAmenities.length}
                                    </span>
                                )}
                            </button>
                            <div className="relative">
                                <select 
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-brand-accent py-2 pl-3 pr-8 cursor-pointer transition-colors"
                                >
                                    <option value="recommended">{t('accommodationPage.sortRecommended')}</option>
                                    <option value="rating">{t('accommodationPage.sortRating')}</option>
                                    <option value="price_asc">{t('accommodationPage.sortPriceAsc')}</option>
                                    <option value="price_desc">{t('accommodationPage.sortPriceDesc')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {isFilterPanelOpen && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm my-6 animate-zoom-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-serif font-bold text-lg text-brand-text dark:text-gray-100">{t('accommodationPage.amenities')}</h4>
                            {selectedAmenities.length > 0 && (
                                 <button onClick={() => setSelectedAmenities([])} className="text-sm font-semibold text-brand-accent hover:underline dark:hover:underline">
                                    {t('accommodationPage.clearAll')}
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {allAmenities.map(amenityKey => (
                                 <label key={amenityKey} className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedAmenities.includes(amenityKey)}
                                        onChange={() => handleAmenityChange(amenityKey)}
                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-brand-accent focus:ring-brand-accent dark:bg-gray-700"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(`amenities.${amenityKey}`)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                
                {bannerLoading ? (
                    <div className="my-8 md:my-12">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl aspect-[4/3] md:aspect-[3/1]"></div>
                    </div>
                ) : activeAccommodationBanner && (
                    <Banner banner={activeAccommodationBanner} />
                )}

                <div id="listings-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(8)].map((_, i) => <SkeletonAccommodationCard key={i} />)
                    ) : (
                        displayedAccommodations.map(item => (
                            <AccommodationCard key={item.id} item={item} onClick={() => handleCardClick(item)} />
                        ))
                    )}
                </div>

                { !loading && displayedAccommodations.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('accommodationPage.noResults')}</p>
                    </div>
                )}

                <Modal item={selectedItem} onClose={handleCloseModal} />
            </div>
        </>
    );
};

export default AccommodationPage;
