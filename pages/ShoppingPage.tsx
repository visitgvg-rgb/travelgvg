
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Modal from '../components/Modal';
import TagIcon from '../components/icons/TagIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import type { Restaurant as ShoppingItem, Listing, Banner as BannerType, MultiLangString } from '../types'; // Reusing Restaurant type for shopping items
import { useTranslation } from '../i18n';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import Banner from '../components/Banner';
import SkeletonShoppingCard from '../components/SkeletonShoppingCard';
import { sortAndShuffleListings } from '../utils/helpers';
import SEO from '../components/SEO';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

const ShoppingPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const [shoppingListings, setShoppingListings] = useState<ShoppingItem[]>([]);
    const [shuffledShoppingListings, setShuffledShoppingListings] = useState<ShoppingItem[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [bannerLoading, setBannerLoading] = useState(true);
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const filters = [
        t('filters.all'), 
        t('filters.malls'), 
        t('filters.boutiques'), 
        t('filters.shoes'), 
        t('filters.forKids'), 
        t('filters.supermarkets'), 
        t('filters.pharmacies'), 
        t('filters.localProducts'),
        t('filters.piljari')
    ];

    // Mapping for filters to categories in JSON
    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.malls')]: "trgovski-centri",
        [t('filters.boutiques')]: "butici",
        [t('filters.shoes')]: "obuvki",
        [t('filters.forKids')]: "za-deca",
        [t('filters.supermarkets')]: "supermarketi",
        [t('filters.pharmacies')]: "apteki",
        [t('filters.localProducts')]: "domasni-proizvodi",
        [t('filters.piljari')]: "piljari"
    };

    useEffect(() => {
        const fetchShoppingData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/shopping.json');
                const data: ShoppingItem[] = await response.json();
                
                setShoppingListings(data);
                setShuffledShoppingListings(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch shopping data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShoppingData();
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

    useEffect(() => {
        setActiveFilter(t('filters.all'));
    }, [t]);

    useEffect(() => {
        if (shoppingListings.length === 0) return;

        const params = new URLSearchParams(location.search);
        const itemId = params.get('open');

        if (itemId) {
            const itemToOpen = shoppingListings.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
                navigate(location.pathname, { replace: true });
            }
        }
    }, [shoppingListings, location.search, navigate]);
    
    const filteredShoppingListings = useMemo(() => {
        if (activeFilter === t('filters.all')) {
            return shuffledShoppingListings;
        } else {
            const categoryToFilter = filterCategoryMap[activeFilter];
            const filtered = shuffledShoppingListings.filter(item => item.category === categoryToFilter);
            return filtered;
        }
    }, [activeFilter, shuffledShoppingListings, t, filterCategoryMap]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };
    
    const handleCardClick = (item: Listing) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const activeShoppingBanner = useMemo(() => banners.find(banner => {
        if (!banner.placement.includes('shopping-list-top') || !banner.config.isActive) {
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
            <SEO title={t('seo.shopping')} description={t('homepage.shoppingGuideDesc')} />
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
                            {t('shoppingPage.title')}
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
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-blue-200/50 dark:border-blue-500/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 p-6">
                            {/* Main Info */}
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="hidden md:block flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                                    <TagIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('shoppingPage.infoBoxTitle')}</h3>
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('shoppingPage.infoBoxDesc')}</p>
                                </div>
                            </div>

                            {/* Desktop Pro-Tip (Hidden on Mobile) */}
                            <div className="hidden md:block flex-shrink-0 w-full md:w-auto md:max-w-xs lg:max-w-sm">
                                <div className="bg-white/50 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <LightbulbIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('shoppingPage.proTipTitle')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('shoppingPage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <div className="w-full overflow-x-auto hide-scrollbar">
                        <div className="flex space-x-2 justify-start sm:justify-center py-4 px-4 sm:px-0">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => handleFilterChange(filter)}
                                    className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0.5 ${
                                        activeFilter === filter
                                            ? 'bg-brand-accent text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <span>{filter}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {bannerLoading ? (
                    <div className="my-8 md:my-12">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl aspect-[4/3] md:aspect-[3/1]"></div>
                    </div>
                ) : activeShoppingBanner && (
                    <Banner banner={activeShoppingBanner} />
                )}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {loading ? (
                         [...Array(8)].map((_, i) => <SkeletonShoppingCard key={i} />)
                    ) : (
                        filteredShoppingListings.map(item => (
                            <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                        ))
                    )}
                </div>

                { !loading && filteredShoppingListings.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('shoppingPage.noResults')}</p>
                    </div>
                )}

                <Modal item={selectedItem} onClose={handleCloseModal} />
            </div>
        </>
    );
};

export default ShoppingPage;
