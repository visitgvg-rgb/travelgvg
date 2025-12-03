
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import SkeletonCard from '../components/SkeletonCard';
import Breadcrumbs from '../components/Breadcrumbs';
import type { Restaurant, Listing, Banner as BannerType, MultiLangString } from '../types';
import UtensilsCrossedIcon from '../components/icons/UtensilsCrossedIcon';
import { useTranslation } from '../i18n';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import Banner from '../components/Banner';
import { sortAndShuffleListings } from '../utils/helpers';
import SEO from '../components/SEO';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

const RestaurantsPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const [allFood, setAllFood] = useState<Restaurant[]>([]);
    const [shuffledRestaurants, setShuffledRestaurants] = useState<Restaurant[]>([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('recommended');
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [bannerLoading, setBannerLoading] = useState(true);
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const filterKeys = ['all', 'restaurants', 'pizzerias', 'fast-food', 'healthy-food'];
    const filters = filterKeys.map(key => ({ key, label: t(`filters.${key.replace(/-(\w)/g, (_, c) => c.toUpperCase())}`) }));

    const filterCategoryMap: { [key: string]: string } = {
        "restaurants": "restorani",
        "pizzerias": "picerii",
        "fast-food": "brza-hrana",
        "healthy-food": "zdrava-ishrana"
    };
    
    useEffect(() => {
        const fetchFoodData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/restaurants.json');
                const data: Restaurant[] = await response.json();
                setAllFood(data);
                setShuffledRestaurants(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch food data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFoodData();
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
    
    const displayedRestaurants = useMemo(() => {
        let filteredItems: Restaurant[];

        if (activeFilter === 'all') {
            filteredItems = [...allFood];
        } else {
            const categoryToFilter = filterCategoryMap[activeFilter];
            filteredItems = allFood.filter(item => item.category === categoryToFilter);
        }

        switch(sortOrder) {
            case 'rating':
                return [...filteredItems].sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0));
            case 'reviews':
                return [...filteredItems].sort((a, b) => (b.rating?.reviews || 0) - (a.rating?.reviews || 0));
            case 'recommended':
            default:
                const shuffledIds = shuffledRestaurants.map(item => item.id);
                return [...filteredItems].sort((a, b) => shuffledIds.indexOf(a.id) - shuffledIds.indexOf(b.id));
        }
    }, [allFood, shuffledRestaurants, activeFilter, sortOrder, filterCategoryMap]);

    const activeRestaurantBanner = useMemo(() => banners.find(banner => {
        if (!banner.placement.includes('restaurants-list-top') || !banner.config.isActive) {
            return false;
        }
        if (!banner.config.targetCategory || activeFilter === 'all') {
            return true;
        }
        const categoryToFilter = filterCategoryMap[activeFilter];
        return banner.config.targetCategory === categoryToFilter;
    }), [banners, activeFilter, filterCategoryMap]);

    return (
        <>
            <SEO
                title={t('seo.restaurants')}
                description={t('homepage.whereToEatDesc')}
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
                            {t('whereToEatPage.title')}
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
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-green-200/50 dark:border-green-500/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 p-6">
                            {/* Main Info */}
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="hidden md:block flex-shrink-0 bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                                    <UtensilsCrossedIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('whereToEatPage.infoBoxTitle')}</h3>
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('whereToEatPage.infoBoxDesc')}</p>
                                </div>
                            </div>

                            {/* Desktop Pro-Tip (Hidden on Mobile) */}
                            <div className="hidden md:block flex-shrink-0 w-full md:w-auto md:max-w-xs lg:max-w-sm">
                                <div className="bg-white/50 dark:bg-gray-800/50 border border-green-100 dark:border-green-500/20 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <LightbulbIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('whereToEatPage.proTipTitle')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('whereToEatPage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Unified Controls Bar */}
                 <div id="filter-controls" className="mb-4">
                    {/* --- Mobile View --- */}
                    <div className="sm:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2">
                        {/* Category Filters */}
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className="flex items-center space-x-2 p-2">
                                {filters.map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => setActiveFilter(f.key)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                                            activeFilter === f.key
                                                ? 'bg-brand-accent text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 mx-2"></div>
                        
                        {/* Sort Filter */}
                        <div className="flex items-center justify-between p-2">
                            <label htmlFor="sort-order-mobile" className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                {t('accommodationPage.sortBy')}
                            </label>
                            <div className="relative">
                                <select 
                                    id="sort-order-mobile"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-brand-accent py-2 pl-3 pr-8 cursor-pointer transition-colors"
                                >
                                    <option value="recommended">{t('accommodationPage.sortRecommended')}</option>
                                    <option value="rating">{t('accommodationPage.sortRating')}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Desktop View --- */}
                    <div className="hidden sm:flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg dark:border dark:border-gray-700">
                        <div className="flex-grow overflow-x-auto hide-scrollbar border-r border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2 p-4">
                                {filters.map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => setActiveFilter(f.key)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                                            activeFilter === f.key
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
                            <div className="relative">
                                <select 
                                    id="sort-order-desktop"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-brand-accent py-2 pl-3 pr-8 cursor-pointer transition-colors"
                                >
                                    <option value="recommended">{t('accommodationPage.sortRecommended')}</option>
                                    <option value="rating">{t('accommodationPage.sortRating')}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {bannerLoading ? (
                    <div className="my-8 md:my-12">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl aspect-[4/3] md:aspect-[3/1]"></div>
                    </div>
                ) : activeRestaurantBanner && (
                    <Banner banner={activeRestaurantBanner} />
                )}

                <div id="listings-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        displayedRestaurants.map(item => (
                            <Card key={item.id} item={item} />
                        ))
                    )}
                </div>

                { !loading && displayedRestaurants.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('whereToEatPage.noResults')}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default RestaurantsPage;
