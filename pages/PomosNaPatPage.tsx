
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import TowTruckIcon from '../components/icons/TowTruckIcon';
import WrenchIcon from '../components/icons/WrenchIcon';
import TireIcon from '../components/icons/TireIcon';
import WarningIcon from '../components/icons/WarningIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../i18n';
import type { Pomos, Listing, MultiLangString } from '../types';
import Modal from '../components/Modal';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import { sortAndShuffleListings } from '../utils/helpers';
import SEO from '../components/SEO';

const PomosNaPatPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;

    const location = useLocation();
    const [pomosListings, setPomosListings] = useState<Pomos[]>([]);
    const [shuffledPomosListings, setShuffledPomosListings] = useState<Pomos[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [isProTipOpen, setIsProTipOpen] = useState(false);
    const navigate = useNavigate();
    const isInitialMount = useRef(true);
    
    // UI State for Mobile Collapsible Header
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const filters = [t('filters.all'), t('filters.towTrucks'), t('filters.mechanics'), t('filters.tireServices')];

    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.towTrucks')]: "slep-sluzbi",
        [t('filters.mechanics')]: "avtomehanicari",
        [t('filters.tireServices')]: "vulkanizeri",
    };
    
    useEffect(() => {
        const initialFilterFromState = location.state?.filter;
        const initialFilter = initialFilterFromState ? t(`filters.${initialFilterFromState}`) : t('filters.all');
        setActiveFilter(initialFilter);
    }, [location.state, t]);

    useEffect(() => {
        const fetchPomosData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/pomos.json');
                const data: Pomos[] = await response.json();
                setPomosListings(data);
                setShuffledPomosListings(sortAndShuffleListings(data));
            } catch (error) {
                console.error("Failed to fetch pomos na pat data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPomosData();
    }, []);
    
    const filteredPomosListings = useMemo(() => {
        if (activeFilter === t('filters.all')) {
            return shuffledPomosListings;
        } else {
            const categoryToFilter = filterCategoryMap[activeFilter];
            const filtered = shuffledPomosListings.filter(item => item.category === categoryToFilter);
            return filtered;
        }
    }, [activeFilter, shuffledPomosListings, t, filterCategoryMap]);
    
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const listingsGrid = document.getElementById('listings-grid');
        const header = document.querySelector('header');
        
        if (listingsGrid && header) {
            const headerHeight = header.offsetHeight;
            const gridTop = listingsGrid.getBoundingClientRect().top;
            
            if (gridTop < headerHeight) {
                const newScrollY = window.scrollY + gridTop - headerHeight - 16;
                 window.scrollTo({
                    top: newScrollY,
                    behavior: 'smooth'
                });
            }
        }
    }, [filteredPomosListings]);

    useEffect(() => {
        if (pomosListings.length === 0) return;

        const params = new URLSearchParams(location.search);
        const itemId = params.get('open');

        if (itemId) {
            const itemToOpen = pomosListings.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
                navigate(location.pathname, { replace: true });
            }
        }
    }, [pomosListings, location.search, navigate]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    const handleCardClick = (item: Pomos) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const getServiceIcon = (category: string) => {
        const iconClass = "w-8 h-8 text-brand-accent";
        switch (category) {
            case 'slep-sluzbi':
                return <TowTruckIcon className={iconClass} />;
            case 'avtomehanicari':
                return <WrenchIcon className={iconClass} />;
            case 'vulkanizeri':
                return <TireIcon className={iconClass} />;
            default:
                return null;
        }
    };

    const SkeletonCard = () => (
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg animate-pulse"></div>
    );

    return (
        <>
            <SEO title={t('seo.roadsideAssistance')} />
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
                            {t('roadsideAssistancePage.title')}
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
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-red-200/50 dark:border-red-500/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 p-6">
                            {/* Main Info */}
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="hidden md:block flex-shrink-0 bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                                    <WarningIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{t('roadsideAssistancePage.infoBoxTitle')}</h3>
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{t('roadsideAssistancePage.infoBoxDesc')}</p>
                                </div>
                            </div>

                            {/* Desktop Pro-Tip */}
                            <div className="hidden md:block flex-shrink-0 w-full md:w-auto md:max-w-xs lg:max-w-sm">
                                <div className="bg-white/50 dark:bg-gray-800/50 border border-red-100 dark:border-red-500/20 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <LightbulbIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('roadsideAssistancePage.proTipTitle')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('roadsideAssistancePage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Collapsible Pro-Tip */}
                        <div className="md:hidden border-t border-red-100 dark:border-red-800/30">
                            <button
                                onClick={() => setIsProTipOpen(!isProTipOpen)}
                                className="w-full flex justify-between items-center p-4 text-left group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                aria-expanded={isProTipOpen}
                                aria-controls="pro-tip-content-pomos"
                            >
                                <div className="flex items-center space-x-3">
                                    <LightbulbIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('roadsideAssistancePage.proTipTitle')}</h4>
                                </div>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isProTipOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div 
                                id="pro-tip-content-pomos"
                                className={`grid transition-all duration-300 ease-in-out ${isProTipOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-4 pb-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('roadsideAssistancePage.proTipDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                </div>

                <div id="listings-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {loading ? (
                        [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        filteredPomosListings.map(item => (
                            <div key={item.id} onClick={() => handleCardClick(item)} 
                                className="relative h-96 rounded-lg shadow-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            >
                                {item.images && item.images.length > 0 && <img src={item.images?.[0]} alt={item.title[lang]} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            
                                {item.package === 'premium' && (
                                    <div className="absolute top-3 right-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-md z-10">{t('premium').toUpperCase()}</div>
                                )}
                            
                                <div className="relative p-5 flex flex-col justify-end h-full text-white">
                                    <div>
                                        <div className="flex items-start space-x-4 mb-3">
                                            <div className="flex-shrink-0 pt-1">{getServiceIcon(item.category)}</div>
                                            <div>
                                                <h3 className="text-lg font-serif font-bold leading-tight">{item.title[lang]}</h3>
                                                {item.workingHours === '24/7' ? (
                                                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">24/7 {t('availability')}</span>
                                                ) : (
                                                    <p className="text-gray-300 text-xs mt-1">{item.workingHours}</p>
                                                )}
                                            </div>
                                        </div>
                                        <a href={`tel:${item.contact.phone}`} onClick={(e) => e.stopPropagation()} className="mt-4 flex items-center justify-center w-full bg-red-600 font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 text-base shadow-md">
                                            <PhoneIcon className="w-5 h-5 mr-2" />
                                            {t('modal.callNow')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                { !loading && filteredPomosListings.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('roadsideAssistancePage.noResults')}</p>
                    </div>
                )}
            </div>
            <Modal item={selectedItem} onClose={handleCloseModal} />
        </>
    );
};

export default PomosNaPatPage;
