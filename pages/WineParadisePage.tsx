
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import GrapeIcon from '../components/icons/GrapeIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../i18n';
import type { Restaurant as WineryItem, Listing, MultiLangString, Banner as BannerType } from '../types'; // Reusing Restaurant type for items
import WineryCard from '../components/WineryCard';
import Banner from '../components/Banner';
import { sortAndShuffleListings } from '../utils/helpers';
import SEO from '../components/SEO';

const WineParadisePage: React.FC = () => {
    const { t } = useTranslation();

    const [wineryListings, setWineryListings] = useState<WineryItem[]>([]);
    const [shuffledWineryListings, setShuffledWineryListings] = useState<WineryItem[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [bannerLoading, setBannerLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const filters = [t('filters.all'), t('filters.withTasting'), t('filters.wineSale'), t('filters.wineryTour')];

    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.withTasting')]: "degustacija",
        [t('filters.wineSale')]: "prodazba",
        [t('filters.wineryTour')]: "tura",
    };

    useEffect(() => {
        const fetchWineryData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/vinski-raj.json');
                const data: WineryItem[] = await response.json();
                setWineryListings(data);
                setShuffledWineryListings(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch winery data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWineryData();
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
        if (wineryListings.length === 0) return;

        const params = new URLSearchParams(location.search);
        const itemId = params.get('open');

        if (itemId) {
            const itemToOpen = wineryListings.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
                navigate(location.pathname, { replace: true });
            }
        }
    }, [wineryListings, location.search, navigate]);
    
    const filteredWineryListings = useMemo(() => {
        if (activeFilter === t('filters.all')) {
            return shuffledWineryListings;
        } else {
            const featureToFilter = filterCategoryMap[activeFilter];
            return shuffledWineryListings.filter(item => item.features?.includes(featureToFilter));
        }
    }, [activeFilter, shuffledWineryListings, t, filterCategoryMap]);
    
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };
    
    const handleCardClick = (item: Listing) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const activeWineBanner = useMemo(() => banners.find(banner => {
        if (!banner.placement.includes('wine-list-top') || !banner.config.isActive) {
            return false;
        }
        if (!banner.config.targetCategory || activeFilter === t('filters.all')) {
            return true;
        }
        const categoryToFilter = filterCategoryMap[activeFilter];
        return banner.config.targetCategory === categoryToFilter;
    }), [banners, activeFilter, t, filterCategoryMap]);

    return (
        <div className="relative bg-slate-900">
            <SEO title={t('seo.wineParadise')} description={t('homepage.wineParadiseDesc')} />
            {/* Background Image and Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/homepage-tsx/wine-paradise-background-section-background.webp" 
                    alt="" 
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
            </div>
            
            <div className="relative z-10">
                <Breadcrumbs backgroundClass="bg-transparent" />
                
                {/* Hero Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-16 text-center text-white">
                    <GrapeIcon className="w-16 h-16 text-purple-300 mb-4 mx-auto" />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black drop-shadow-lg">{t('winePage.title')}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-purple-200 drop-shadow">{t('winePage.infoBoxDesc')}</p>
                </div>

                {/* Filters and Cards */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="bg-white/10 backdrop-blur-md shadow-sm rounded-lg mb-8 border border-white/10 max-w-4xl mx-auto">
                        <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                    </div>

                    {bannerLoading ? (
                        <div className="my-8 md:my-12">
                            <div className="animate-pulse bg-gray-700 rounded-xl aspect-[4/3] md:aspect-[3/1]"></div>
                        </div>
                    ) : activeWineBanner && (
                        <Banner banner={activeWineBanner} />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="relative h-96 rounded-lg bg-gray-700 shadow-md overflow-hidden animate-pulse"></div>
                            ))
                        ) : (
                            filteredWineryListings.map(item => (
                                <WineryCard key={item.id} item={item} onDetailsClick={() => handleCardClick(item)} />
                            ))
                        )}
                    </div>

                    { !loading && filteredWineryListings.length === 0 && (
                        <div className="text-center col-span-full py-16">
                            <p className="text-gray-300 text-lg">{t('winePage.noResults')}</p>
                        </div>
                    )}
                </div>

                <Modal item={selectedItem} onClose={handleCloseModal} />
            </div>
        </div>
    );
};

export default WineParadisePage;
