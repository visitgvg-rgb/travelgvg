
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../i18n';
import type { Restaurant as GasStationItem, Listing, MultiLangString, Banner as BannerType } from '../types';
import Banner from '../components/Banner';
import SkeletonCard from '../components/SkeletonCard';
import { sortAndShuffleListings } from '../utils/helpers';
import GasPumpIcon from '../components/icons/GasPumpIcon';
import CarWashIcon from '../components/icons/CarWashIcon';
import CarIcon from '../components/icons/CarIcon';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import SEO from '../components/SEO';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

const GasStationsPage: React.FC = () => {
    const { t } = useTranslation();
    const [listings, setListings] = useState<GasStationItem[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState<BannerType[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const filters = [
        { label: t('filters.all'), key: 'all' },
        { label: t('filters.gasStations'), key: 'benzinski-pumpi', icon: <GasPumpIcon className="w-5 h-5" /> },
        { label: t('filters.carWashes'), key: 'avto-peralni', icon: <CarWashIcon className="w-5 h-5" /> },
        { label: t('filters.rentACar'), key: 'rent-a-car', icon: <CarIcon className="w-5 h-5" /> }
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/gas-stations.json');
                const data: GasStationItem[] = await response.json();
                setListings(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch gas stations data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/data/banners.json');
                if (!res.ok) throw new Error('Failed to fetch banners');
                const data: BannerType[] = await res.json();
                setBanners(data);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            }
        };
        fetchBanners();
    }, []);

    // Deep linking
    useEffect(() => {
        if (listings.length === 0) return;
        const params = new URLSearchParams(location.search);
        const itemId = params.get('open');
        if (itemId) {
            const itemToOpen = listings.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
                navigate(location.pathname, { replace: true });
            }
        }
    }, [listings, location.search, navigate]);

    const filteredListings = useMemo(() => {
        const currentFilterKey = filters.find(f => f.label === activeFilter)?.key || 'all';
        if (currentFilterKey === 'all') {
            return listings;
        }
        return listings.filter(item => item.category === currentFilterKey);
    }, [activeFilter, listings, filters]);

    return (
        <>
            <SEO title={t('seo.gasStations')} />
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
                            {t('gasStationsPage.title')}
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
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-teal-200/50 dark:border-teal-500/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 p-6">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="hidden md:block flex-shrink-0 bg-teal-100 dark:bg-teal-900/50 p-3 rounded-full">
                                    <GasPumpIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('gasStationsPage.infoBoxTitle')}</h3>
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('gasStationsPage.infoBoxDesc')}</p>
                                </div>
                            </div>
                            <div className="hidden md:block flex-shrink-0 w-full md:w-auto md:max-w-xs lg:max-w-sm">
                                <div className="bg-white/50 dark:bg-gray-800/50 border border-teal-100 dark:border-teal-500/20 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <LightbulbIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('gasStationsPage.proTipTitle')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('gasStationsPage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <FilterBar 
                        filters={filters.map(f => f.icon ? { label: f.label, icon: f.icon } : f.label)} 
                        activeFilter={activeFilter} 
                        onFilterChange={setActiveFilter} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                    {loading ? (
                        [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        filteredListings.map(item => (
                            <Card key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                        ))
                    )}
                </div>

                {!loading && filteredListings.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('gasStationsPage.noResults')}</p>
                    </div>
                )}

                <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
            </div>
        </>
    );
};

export default GasStationsPage;
