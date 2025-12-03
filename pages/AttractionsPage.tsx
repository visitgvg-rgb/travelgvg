import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import SkeletonCard from '../components/SkeletonCard';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import type { Restaurant as AtrakcijaItem, Listing, MultiLangString } from '../types';
import { useTranslation } from '../i18n';
import { sortAndShuffleListings } from '../utils/helpers';
import SEO from '../components/SEO';

const FeaturedAttractionHeader: React.FC<{ item: AtrakcijaItem; onClick: (item: AtrakcijaItem) => void; }> = ({ item, onClick }) => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    
    return (
        <div className="relative rounded-lg overflow-hidden shadow-xl mb-12 h-96 md:h-[450px] group cursor-pointer" onClick={() => onClick(item)}>
            <img src={item.images[0]} alt={item.title[lang]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-center p-8 md:p-12 text-white max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-serif font-black mb-4 drop-shadow-lg">{item.title[lang]}</h2>
                <p className="text-base md:text-lg mb-8 drop-shadow-md line-clamp-3">{item.description[lang]}</p>
                <div className="self-start">
                    <span
                        className="bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg transform group-hover:-translate-y-0.5"
                    >
                        {t('card.seeMore')}
                    </span>
                </div>
            </div>
        </div>
    );
};

const AttractionsPage: React.FC = () => {
    const { t } = useTranslation();
    const [allAttractions, setAllAttractions] = useState<AtrakcijaItem[]>([]);
    const [featuredAttraction, setFeaturedAttraction] = useState<AtrakcijaItem | null>(null);
    const [otherAttractions, setOtherAttractions] = useState<AtrakcijaItem[]>([]);
    const [shuffledOtherAttractions, setShuffledOtherAttractions] = useState<AtrakcijaItem[]>([]);
    const [activeFilter, setActiveFilter] = useState(t('filters.all'));
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const isInitialMount = useRef(true);

    const filters = [t('filters.all'), t('filters.naturalBeauty'), t('filters.historicalSites'), t('filters.museums')];

    const filterCategoryMap: { [key: string]: string } = {
        [t('filters.naturalBeauty')]: "prirodni-ubavini",
        [t('filters.historicalSites')]: "istoriski-lokaliteti",
        [t('filters.museums')]: "muzei",
    };

    useEffect(() => {
        const fetchAtrakciiData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/atrakcii.json');
                const data: AtrakcijaItem[] = await response.json();
                
                const featured = data.find(item => item.package === 'premium') || data[0] || null;
                const others = data.filter(item => item.id !== featured?.id);

                setAllAttractions(data);
                setFeaturedAttraction(featured);
                setOtherAttractions(others);
                setShuffledOtherAttractions(sortAndShuffleListings(others));

            } catch (error) {
                console.error("Failed to fetch atrakcii data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAtrakciiData();
    }, []);

    useEffect(() => {
        setActiveFilter(t('filters.all'));
    }, [t]);
    
    const filteredAttractions = useMemo(() => {
        if (activeFilter === t('filters.all')) {
            return shuffledOtherAttractions;
        } else {
            const categoryToFilter = filterCategoryMap[activeFilter];
            return shuffledOtherAttractions.filter(item => item.category === categoryToFilter);
        }
    }, [activeFilter, shuffledOtherAttractions, t, filterCategoryMap]);
    
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
    }, [filteredAttractions]);

    useEffect(() => {
        if (allAttractions.length === 0) return;

        const params = new URLSearchParams(location.search);
        const itemId = params.get('open');

        if (itemId) {
            const itemToOpen = allAttractions.find(item => item.id === itemId);
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
                navigate(location.pathname, { replace: true });
            }
        }
    }, [allAttractions, location.search, navigate]);
    
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };
    
    const handleCardClick = (item: Listing) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    return (
        <>
            <SEO title={t('seo.attractions')} description={t('homepage.attractionsDesc')} />
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-brand-text dark:text-gray-100">{t('attractionsPage.title')}</h1>
                </div>
                
                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-96 md:h-[450px] bg-gray-300 dark:bg-gray-700 rounded-lg mb-12"></div>
                    </div>
                ) : featuredAttraction && (
                    <FeaturedAttractionHeader item={featuredAttraction} onClick={handleCardClick} />
                )}

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                </div>

                <div id="listings-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                     {loading ? (
                         [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        filteredAttractions.map(item => (
                            <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                        ))
                    )}
                </div>
                
                { !loading && filteredAttractions.length === 0 && (
                    <div className="text-center col-span-full py-16">
                        <p className="text-gray-500 dark:text-gray-400">{t('attractionsPage.noResults')}</p>
                    </div>
                )}


                <Modal item={selectedItem} onClose={handleCloseModal} />
            </div>
        </>
    );
};

export default AttractionsPage;