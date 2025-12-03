
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import InfoPanel from '../components/InfoPanel';
import Card from '../components/Card';
import Modal from '../components/Modal';
import SkeletonCard from '../components/SkeletonCard';
import TagIcon from '../components/icons/TagIcon';
import type { Accommodation, Restaurant, Listing, Pomos, Ponuda, Prikazna, Restaurant as ShoppingItem, Restaurant as AtrakcijaItem, Restaurant as WineryItem, MultiLangString, Banner as BannerType } from '../types';
import BedIcon from '../components/icons/BedIcon';
import UtensilsCrossedIcon from '../components/icons/UtensilsCrossedIcon';
import HeroSlider from '../components/HeroSlider';
import StoreIcon from '../components/icons/StoreIcon';
import MapTourIcon from '../components/icons/MapTourIcon';
import GrapeIcon from '../components/icons/GrapeIcon';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import AccommodationCard from '../components/AccommodationCard';
import SkeletonAccommodationCard from '../components/SkeletonAccommodationCard';
import LazySection from '../components/LazySection';
import SectionSkeleton from '../components/SectionSkeleton';
import { useTranslation } from '../i18n';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import QuickLinks from '../components/QuickLinks';
import UserIcon from '../components/icons/UserIcon';
import WineryCard from '../components/WineryCard';
import PhotographersSection from '../components/PhotographersSection';
import Banner from '../components/Banner';
import ShortsSection from '../components/ShortsSection';
import MobileQuickNav from '../components/MobileQuickNav';
import PomosNaPatLink from '../components/PomosNaPatLink';
import SkeletonPosterCard from '../components/SkeletonPosterCard';
import SkeletonOfferCard from '../components/SkeletonOfferCard';
import SkeletonShoppingCard from '../components/SkeletonShoppingCard';
import CasinoChipIcon from '../components/icons/CasinoChipIcon';
import SectionHeader from '../components/SectionHeader';
import { sortAndShuffleListings } from '../utils/helpers';
import { useCache } from '../context/CacheContext';
import SchemaMarkup from '../components/SchemaMarkup';
import VideoCameraIcon from '../components/icons/VideoCameraIcon';
import CameraIcon from '../components/icons/CameraIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import CarIcon from '../components/icons/CarIcon';
import CheckIcon from '../components/icons/CheckIcon';
import GasPumpIcon from '../components/icons/GasPumpIcon';
import QuestionMarkIcon from '../components/icons/QuestionMarkIcon';
import SEO from '../components/SEO';
import SparklesIcon from '../components/icons/SparklesIcon';

// New Elegant App Card
const ModernAppCard: React.FC<{ 
    to: string; 
    icon: React.ReactNode; 
    label: string; 
    iconColor: string;
    iconBg: string;
    delay: number;
}> = ({ to, icon, label, iconColor, iconBg, delay }) => (
    <Link 
        to={to} 
        className="group relative flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 active:scale-95 transition-all duration-200 animate-fade-in-slide-up hover:shadow-md"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-3 transition-transform group-hover:scale-110 group-active:scale-95`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: `w-7 h-7 ${iconColor}` })}
        </div>
        <span className="font-bold text-gray-700 dark:text-gray-200 text-xs sm:text-sm text-center leading-tight">
            {label}
        </span>
    </Link>
);

const AppSectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1 mt-6 first:mt-2">
        {title}
    </h3>
);

const Homepage: React.FC = () => {
    const { t, language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { homepageCache, setHomepageCache } = useCache();
    
    const [loading, setLoading] = useState(!homepageCache);
    const [bannerLoading, setBannerLoading] = useState(!homepageCache);

    const [mobileViewMode, setMobileViewMode] = useState<'classic' | 'app'>(() => {
        const savedMode = localStorage.getItem('mobileViewMode');
        return (savedMode === 'app' || savedMode === 'classic') ? savedMode : 'classic';
    });

    const [showAppModeToast, setShowAppModeToast] = useState(false);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [featuredAccommodations, setFeaturedAccommodations] = useState<Accommodation[]>(homepageCache?.accommodations || []);
    const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>(homepageCache?.restaurants || []);
    const [featuredShopping, setFeaturedShopping] = useState<ShoppingItem[]>(homepageCache?.shopping || []);
    const [featuredEntertainment, setFeaturedEntertainment] = useState<ShoppingItem[]>(homepageCache?.entertainment || []);
    const [featuredAtrakcii, setFeaturedAtrakcii] = useState<AtrakcijaItem[]>(homepageCache?.attractions || []);
    const [featuredWineries, setFeaturedWineries] = useState<WineryItem[]>(homepageCache?.wineries || []);
    const [allPomos, setAllPomos] = useState<Pomos[]>(homepageCache?.pomos || []);
    const [featuredPonudi, setFeaturedPonudi] = useState<Ponuda[]>(homepageCache?.ponudi || []);
    const [featuredPrikazni, setFeaturedPrikazni] = useState<Prikazna[]>(homepageCache?.prikazni || []);
    const [banners, setBanners] = useState<BannerType[]>([]);
    
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    
    const desktopAccSliderRef = useRef<HTMLDivElement | null>(null);
    const [showAccPrev, setShowAccPrev] = useState(false);
    const [showAccNext, setShowAccNext] = useState(false);
    const [accSliderNode, setAccSliderNode] = useState<HTMLDivElement | null>(null);
    
    const desktopRestSliderRef = useRef<HTMLDivElement | null>(null);
    const [showRestPrev, setShowRestPrev] = useState(false);
    const [showRestNext, setShowRestNext] = useState(false);
    const [restSliderNode, setRestSliderNode] = useState<HTMLDivElement | null>(null);

    const sliderRefs = {
        acc: useRef<HTMLDivElement>(null),
        rest: useRef<HTMLDivElement>(null),
        ponuda: useRef<HTMLDivElement>(null),
        atrakcii: useRef<HTMLDivElement>(null),
        winery: useRef<HTMLDivElement>(null),
        shopping: useRef<HTMLDivElement>(null),
        entertainment: useRef<HTMLDivElement>(null),
    };

    const handleViewChange = (mode: 'classic' | 'app') => {
        setMobileViewMode(mode);
        localStorage.setItem('mobileViewMode', mode);
        window.dispatchEvent(new Event('mobileViewModeChanged'));
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (mode === 'app') {
            setShowAppModeToast(true);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => {
                setShowAppModeToast(false);
            }, 3000);
        } else {
            setShowAppModeToast(false);
        }
    };

    useEffect(() => {
        window.dispatchEvent(new Event('mobileViewModeChanged'));
        return () => {
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (homepageCache) {
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setBannerLoading(true);
            try {
                const [
                    accRes, 
                    restRes, 
                    shopRes, 
                    entertainmentRes, 
                    atrakciiRes, 
                    wineryRes, 
                    pomosRes, 
                    ponudiRes, 
                    prikazniRes, 
                    bannersRes
                ] = await Promise.all([
                    fetch('/data/accommodation.json'),
                    fetch('/data/restaurants.json'),
                    fetch('/data/shopping.json'),
                    fetch('/data/zabava.json'),
                    fetch('/data/atrakcii.json'),
                    fetch('/data/vinski-raj.json'),
                    fetch('/data/pomos.json'),
                    fetch('/data/ponudi.json'),
                    fetch('/data/prikazni.json'),
                    fetch('/data/banners.json')
                ]);

                const accData = await accRes.json();
                const restData = await restRes.json();
                const shopData = await shopRes.json();
                const entertainmentData = await entertainmentRes.json();
                const atrakciiData = await atrakciiRes.json();
                const wineryData = await wineryRes.json();
                const pomosData = await pomosRes.json();
                const ponudiData = await ponudiRes.json();
                const prikazniData = await prikazniRes.json();
                const bannersData = await bannersRes.json();

                const processedAcc = sortAndShuffleListings<Accommodation>(accData).slice(0, 10);
                const processedRest = sortAndShuffleListings<Restaurant>(restData).slice(0, 10);
                const processedShop = sortAndShuffleListings<ShoppingItem>(shopData).slice(0, 4);
                const processedEnt = sortAndShuffleListings<Restaurant>(entertainmentData).slice(0, 4);
                const processedAttr = atrakciiData.slice(0, 4);
                const processedWine = wineryData.slice(0, 4);
                const processedPonudi = ponudiData.slice(0, 3);
                const processedPrikazni = [...prikazniData]
                    .sort((a: any, b: any) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime())
                    .slice(0, 4);

                setFeaturedAccommodations(processedAcc);
                setFeaturedRestaurants(processedRest);
                setFeaturedShopping(processedShop);
                setFeaturedEntertainment(processedEnt);
                setFeaturedAtrakcii(processedAttr);
                setFeaturedWineries(processedWine);
                setAllPomos(pomosData);
                setFeaturedPonudi(processedPonudi);
                setFeaturedPrikazni(processedPrikazni);
                setBanners(bannersData);

                setHomepageCache({
                    accommodations: processedAcc,
                    restaurants: processedRest,
                    shopping: processedShop,
                    entertainment: processedEnt,
                    attractions: processedAttr,
                    wineries: processedWine,
                    pomos: pomosData,
                    ponudi: processedPonudi,
                    prikazni: processedPrikazni,
                    banners: bannersData,
                    timestamp: Date.now()
                });

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
                setBannerLoading(false);
            }
        };

        fetchData();
    }, [homepageCache, setHomepageCache]);

    // Deep Linking logic & URL state sync
    useEffect(() => {
        if (loading) return;
    
        const itemId = searchParams.get('open');
    
        if (itemId) {
            const allItems = [
                ...featuredAccommodations,
                ...featuredRestaurants,
                ...featuredShopping,
                ...featuredEntertainment,
                ...featuredAtrakcii,
                ...featuredWineries,
                ...allPomos,
                ...featuredPonudi,
                ...featuredPrikazni,
            ];
    
            const itemToOpen = allItems.find(item => item && item.id === itemId);
    
            if (itemToOpen) {
                setSelectedItem(itemToOpen);
            }
        } else {
            setSelectedItem(null);
        }
    }, [loading, searchParams, featuredAccommodations, featuredRestaurants, featuredShopping, featuredEntertainment, featuredAtrakcii, featuredWineries, allPomos, featuredPonudi, featuredPrikazni]);
    
    const handleDesktopScroll = (ref: React.RefObject<HTMLDivElement>, setPrev: React.Dispatch<React.SetStateAction<boolean>>, setNext: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current;
            const scrollEndReached = scrollWidth - clientWidth - scrollLeft < 1;
            setPrev(scrollLeft > 1);
            setNext(!scrollEndReached);
        }
    };
    
    const scrollDesktopSlider = (ref: React.RefObject<HTMLDivElement>, direction: 'prev' | 'next') => {
        if (ref.current) {
            const cardElement = ref.current.querySelector('div > div');
            if(cardElement) {
                const scrollAmount = cardElement.clientWidth;
                ref.current.scrollBy({
                    left: direction === 'next' ? scrollAmount : -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    useEffect(() => {
        const slider = accSliderNode;
        if (slider) {
            const checkButtons = () => handleDesktopScroll(desktopAccSliderRef, setShowAccPrev, setShowAccNext);
            checkButtons();
            const resizeObserver = new ResizeObserver(checkButtons);
            resizeObserver.observe(slider);
            slider.addEventListener('scroll', checkButtons, { passive: true });
            return () => {
                resizeObserver.disconnect();
                slider.removeEventListener('scroll', checkButtons);
            };
        }
    }, [accSliderNode, featuredAccommodations]);

    useEffect(() => {
        const slider = restSliderNode;
        if (slider) {
            const checkButtons = () => handleDesktopScroll(desktopRestSliderRef, setShowRestPrev, setShowRestNext);
            checkButtons();
            const resizeObserver = new ResizeObserver(checkButtons);
            resizeObserver.observe(slider);
            slider.addEventListener('scroll', checkButtons, { passive: true });
            return () => {
                resizeObserver.disconnect();
                slider.removeEventListener('scroll', checkButtons);
            };
        }
    }, [restSliderNode, featuredRestaurants]);

    const handleCardClick = (item: Listing) => {
        if ('publicationDate' in item) {
            navigate(getLocalizedPath(`/stories/${item.id}`));
        } else {
            // Push state to URL so back button works
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('open', item.id);
                return newParams;
            });
        }
    };

    const handleCloseModal = () => {
        // Remove param from URL (browser back behavior for close)
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('open');
            return newParams;
        });
    };
    
    const activeHomepageBanner = banners.find(
        b => b.placement.includes('homepage-top') && b.config.isActive
    );

    const firstStory = featuredPrikazni.length > 0 ? featuredPrikazni[0] : null;
    const otherStories = featuredPrikazni.length > 1 ? featuredPrikazni.slice(1, 4) : [];

    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "Travel GVG",
                "url": "https://www.travelgvg.com"
            },
            {
                "@type": "Organization",
                "name": "Travel GVG",
                "url": "https://www.travelgvg.com",
                "logo": "https://www.travelgvg.com/favicon.svg",
                "description": "Tourist Portal for Gevgelija"
            }
        ]
    };

    // Organized App Modules
    const appServices = [
        { to: '/accommodation', icon: <BedIcon />, label: t('nav.accommodation'), iconColor: 'text-orange-500', iconBg: 'bg-orange-100 dark:bg-orange-900/30' },
        { to: '/restaurants', icon: <UtensilsCrossedIcon />, label: t('nav.whereToEat'), iconColor: 'text-green-500', iconBg: 'bg-green-100 dark:bg-green-900/30' },
        { to: '/shopping', icon: <StoreIcon />, label: t('nav.shoppingGuide'), iconColor: 'text-blue-500', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
        { to: '/gas-stations', icon: <GasPumpIcon />, label: t('nav.gasStations'), iconColor: 'text-slate-500', iconBg: 'bg-slate-100 dark:bg-slate-800' },
        { to: '/pomos-na-pat', icon: <CarIcon />, label: t('nav.roadsideAssistance'), iconColor: 'text-red-500', iconBg: 'bg-red-100 dark:bg-red-900/30' },
        { to: '/faq', icon: <QuestionMarkIcon />, label: t('nav.faq'), iconColor: 'text-purple-500', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
    ];

    const appExplore = [
        { to: '/attractions', icon: <MapTourIcon />, label: t('nav.localAttractions'), iconColor: 'text-teal-500', iconBg: 'bg-teal-100 dark:bg-teal-900/30' },
        { to: '/wine-paradise', icon: <GrapeIcon />, label: t('nav.wineParadise'), iconColor: 'text-red-800', iconBg: 'bg-red-100 dark:bg-red-900/20' },
        { to: '/stories', icon: <LightbulbIcon />, label: t('nav.stories'), iconColor: 'text-amber-500', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
        { to: '/events', icon: <CalendarIcon />, label: t('nav.events'), iconColor: 'text-indigo-500', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30' },
        { to: '/gvg-play', icon: <VideoCameraIcon />, label: t('nav.videoMoments'), iconColor: 'text-pink-500', iconBg: 'bg-pink-100 dark:bg-pink-900/30' },
        { to: '/photographers', icon: <CameraIcon />, label: t('nav.photographersCorner'), iconColor: 'text-gray-700 dark:text-gray-300', iconBg: 'bg-gray-200 dark:bg-gray-700' },
    ];

    const appSpecials = [
        { to: '/special-offers', icon: <TagIcon />, label: t('nav.specialOffers'), iconColor: 'text-fuchsia-500', iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
        { to: '/entertainment', icon: <CasinoChipIcon />, label: t('nav.entertainment'), iconColor: 'text-rose-500', iconBg: 'bg-rose-100 dark:bg-rose-900/30' },
    ];

    return (
        <div className="bg-brand-bg-light dark:bg-gray-900 min-h-screen">
            <SEO title={t('seo.home')} />
            <SchemaMarkup data={schemaData} />
            <h1 className="sr-only">
                {t('homepage.title') === 'homepage.title' ? 'Travel GVG - Tourist Portal Gevgelija' : t('homepage.title')}
            </h1>

            {/* --- Mobile View Switcher --- */}
            <div className={`md:hidden px-4 py-4 z-20 bg-brand-bg-light/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900/95 transition-all duration-300 ${mobileViewMode === 'app' ? 'sticky top-20' : 'relative'}`}>
                <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-xl flex shadow-inner relative">
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 ease-out left-1 ${mobileViewMode === 'app' ? 'translate-x-full' : 'translate-x-0'}`}></div>

                    <button onClick={() => handleViewChange('classic')} className={`relative flex-1 py-2 text-sm font-bold z-10 transition-colors duration-300 ${mobileViewMode === 'classic' ? 'text-brand-accent' : 'text-gray-500 dark:text-gray-400'}`}>
                        Magazine Mode
                    </button>
                    <button onClick={() => handleViewChange('app')} className={`relative flex-1 py-2 text-sm font-bold z-10 transition-colors duration-300 ${mobileViewMode === 'app' ? 'text-brand-accent' : 'text-gray-500 dark:text-gray-400'}`}>
                        App Mode
                    </button>
                </div>
            </div>

            {/* --- Toast Notification --- */}
            {showAppModeToast && (
                  <div className="fixed inset-x-0 bottom-10 z-50 flex justify-center px-4">
                    <div className="bg-gray-900/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium animate-fade-in-slide-up text-center w-full max-w-sm border border-gray-700/50 flex items-center justify-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span>App mode activated – preference saved</span>
                </div>
                </div>
            )} 

            {/* --- APP MODE --- */}
            <div className={`md:hidden ${mobileViewMode === 'classic' ? 'hidden' : 'block'} animate-fade-in`}>
                
                <div className="px-4 pt-4 pb-24 space-y-6">
                    {/* Section 1: Essentials */}
                    <div>
                        <AppSectionTitle title={t('quickLinks.mainServices')} />
                        <div className="grid grid-cols-2 gap-3">
                            {appServices.map((module, index) => (
                                <ModernAppCard 
                                    key={module.to}
                                    to={getLocalizedPath(module.to)}
                                    icon={module.icon}
                                    label={module.label}
                                    iconColor={module.iconColor}
                                    iconBg={module.iconBg}
                                    delay={index * 50}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Explore */}
                    <div>
                        <AppSectionTitle title={t('quickLinks.exploreMore')} />
                        <div className="grid grid-cols-2 gap-3">
                            {appExplore.map((module, index) => (
                                <ModernAppCard 
                                    key={module.to}
                                    to={getLocalizedPath(module.to)}
                                    icon={module.icon}
                                    label={module.label}
                                    iconColor={module.iconColor}
                                    iconBg={module.iconBg}
                                    delay={index * 50}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Specials */}
                    <div>
                        <AppSectionTitle title="Exclusive" />
                        <div className="grid grid-cols-2 gap-3">
                            {appSpecials.map((module, index) => (
                                <ModernAppCard 
                                    key={module.to}
                                    to={getLocalizedPath(module.to)}
                                    icon={module.icon}
                                    label={module.label}
                                    iconColor={module.iconColor}
                                    iconBg={module.iconBg}
                                    delay={index * 50}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CLASSIC MODE --- */}
            <div className={`${mobileViewMode === 'app' ? 'hidden md:block' : 'block'} bg-white dark:bg-gray-900 transition-opacity duration-500`}>
                <MobileQuickNav />
                <HeroSlider />

                <div className="relative z-10 -mt-6 md:-mt-16">
                    <InfoPanel />
                    <QuickLinks />
                </div>
                
                {bannerLoading ? (
                    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-8">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl aspect-[4/3] md:aspect-[3/1]"></div>
                    </section>
                ) : activeHomepageBanner && (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Banner banner={activeHomepageBanner} />
                    </div>
                )}

                {/* Accommodation Section */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[5]">
                    <section id="smestuvanje" className="bg-white dark:bg-gray-800 py-8 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/accommodation')} title={t('homepage.accommodationTitle')} description={t('homepage.accommodationDesc')} />
                            
                            <div className="hidden md:block relative">
                                <div
                                    ref={node => { desktopAccSliderRef.current = node; setAccSliderNode(node); }}
                                    className="flex overflow-x-auto scroll-smooth hide-scrollbar -mx-4 px-4 snap-x snap-mandatory"
                                >
                                    <div className="flex flex-nowrap gap-8">
                                        {loading ? (
                                            [...Array(4)].map((_, i) => (
                                                <div key={i} className="w-[calc(50vw-3rem)] md:w-[calc(50vw-4rem)] lg:w-[calc(25vw-3rem)] flex-shrink-0 snap-center">
                                                    <SkeletonAccommodationCard />
                                                </div>
                                            ))
                                        ) : (
                                            featuredAccommodations.map(item => (
                                                <div key={item.id} className="w-[calc(85vw-2rem)] sm:w-80 md:w-[calc(50vw-4rem)] lg:w-[calc(25vw-3rem)] flex-shrink-0 snap-center">
                                                    <AccommodationCard item={item} onClick={() => handleCardClick(item)} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {showAccPrev && (
                                    <button 
                                        onClick={() => scrollDesktopSlider(desktopAccSliderRef, 'prev')} 
                                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-brand-text dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
                                        aria-label="Previous accommodations"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                )}
                                {showAccNext && (
                                    <button 
                                        onClick={() => scrollDesktopSlider(desktopAccSliderRef, 'next')} 
                                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-brand-text dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
                                        aria-label="Next accommodations"
                                    >
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="md:hidden relative slider-container-mobile">
                                <div
                                    ref={sliderRefs.acc}
                                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                >
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                <SkeletonPosterCard />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {featuredAccommodations.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="w-48 flex-shrink-0 snap-center"
                                                >
                                                    <AccommodationCard item={item} onClick={() => handleCardClick(item)} variant="poster" />
                                                </div>
                                            ))}
                                            <div className="w-48 flex-shrink-0 snap-center">
                                                <Link
                                                    to={getLocalizedPath('/accommodation')}
                                                    className="flex flex-col items-center justify-center h-full bg-brand-bg-light dark:bg-gray-700 rounded-lg p-4 text-center group transition-all duration-300"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                                        <BedIcon className="w-8 h-8 text-brand-accent"/>
                                                    </div>
                                                    <h3 className="text-base font-serif font-bold text-brand-text dark:text-gray-100 mb-2">{t('homepage.ctaCard.findYourStay')}</h3>
                                                    <span className="mt-4 bg-brand-accent/10 text-brand-accent font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 text-sm">
                                                        {t('homepage.ctaCard.exploreAllAccommodation')}
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>
                
                {/* Restaurants Section */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[4]">
                    <section id="restaurants" className="bg-brand-bg-light dark:bg-gray-900 py-8 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/restaurants')} title={t('homepage.whereToEatTitle')} description={t('homepage.whereToEatDesc')} />
                            
                            <div className="hidden md:block relative">
                                <div
                                    ref={node => { desktopRestSliderRef.current = node; setRestSliderNode(node); }}
                                    className="flex overflow-x-auto scroll-smooth hide-scrollbar -mx-4 px-4 snap-x snap-mandatory"
                                >
                                    <div className="flex flex-nowrap gap-8">
                                        {loading ? (
                                            [...Array(4)].map((_, i) => (
                                                <div key={i} className="w-[calc(50vw-3rem)] md:w-[calc(50vw-4rem)] lg:w-[calc(25vw-3rem)] flex-shrink-0 snap-center">
                                                    <SkeletonCard />
                                                </div>
                                            ))
                                        ) : (
                                            featuredRestaurants.map(item => (
                                                <div key={item.id} className="w-[calc(85vw-2rem)] sm:w-80 md:w-[calc(50vw-4rem)] lg:w-[calc(25vw-3rem)] flex-shrink-0 snap-center">
                                                    <Card item={item} onClick={() => handleCardClick(item)} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {showRestPrev && (
                                    <button 
                                        onClick={() => scrollDesktopSlider(desktopRestSliderRef, 'prev')} 
                                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-brand-text dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
                                        aria-label="Previous restaurants"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>
                                )}
                                {showRestNext && (
                                    <button 
                                        onClick={() => scrollDesktopSlider(desktopRestSliderRef, 'next')} 
                                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-brand-text dark:text-gray-200 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
                                        aria-label="Next restaurants"
                                    >
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="md:hidden relative slider-container-mobile">
                                <div
                                    ref={sliderRefs.rest}
                                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                >
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                <SkeletonPosterCard />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {featuredRestaurants.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="w-48 flex-shrink-0 snap-center"
                                                >
                                                    <Card item={item} onClick={() => handleCardClick(item)} variant="poster"/>
                                                </div>
                                            ))}
                                            <div className="w-48 flex-shrink-0 snap-center">
                                                <Link
                                                    to={getLocalizedPath('/restaurants')}
                                                    className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg p-4 text-center group transition-all duration-300"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                                        <UtensilsCrossedIcon className="w-8 h-8 text-brand-accent"/>
                                                    </div>
                                                    <h3 className="text-base font-serif font-bold text-brand-text dark:text-gray-100 mb-2">{t('homepage.ctaCard.restaurantTitle')}</h3>
                                                    <span className="mt-4 bg-brand-accent/10 text-brand-accent font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 text-sm">
                                                        {t('homepage.ctaCard.exploreAllRestaurants')}
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>

                {/* Special Offers Section */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[3]">
                    <section id="special-offers" className="bg-white dark:bg-gray-800 py-8 md:py-16 z-[3]">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/special-offers')} title={t('homepage.specialOffersTitle')} description={t('homepage.specialOffersDesc')} />
                            
                            <div className="hidden md:grid md:grid-cols-3 gap-8">
                                {loading ? (
                                    [...Array(3)].map((_, i) => <SkeletonOfferCard key={i} />)
                                ) : (
                                    featuredPonudi.map(item => (
                                        <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                                    ))
                                )}
                            </div>
                            
                            <div className="md:hidden relative slider-container-mobile">
                                <div
                                    ref={sliderRefs.ponuda}
                                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                >
                                    {loading ? (
                                        [...Array(2)].map((_, i) => (
                                            <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                <SkeletonPosterCard />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {featuredPonudi.map((item) => (
                                                <div key={item.id} className="w-48 flex-shrink-0 snap-center">
                                                    <Card item={item} onClick={() => handleCardClick(item)} variant="poster" />
                                                </div>
                                            ))}
                                            <div className="w-48 flex-shrink-0 snap-center">
                                                <Link
                                                    to={getLocalizedPath('/special-offers')}
                                                    className="flex flex-col items-center justify-center h-full bg-brand-bg-light dark:bg-gray-700 rounded-lg p-4 text-center group"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-4">
                                                        <TagIcon className="w-8 h-8 text-brand-accent"/>
                                                    </div>
                                                    <h3 className="text-base font-serif font-bold text-brand-text dark:text-gray-100 mb-2">{t('homepage.ctaCard.ponudiTitle')}</h3>
                                                    <span className="mt-4 bg-brand-accent/10 text-brand-accent font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 text-sm">
                                                        {t('homepage.ctaCard.exploreAllOffers')}
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>

                <LazySection placeholder={<SectionSkeleton />} className="relative z-20">
                    <ShortsSection />
                </LazySection>

                <LazySection placeholder={<SectionSkeleton />} className="relative z-10">
                    <PhotographersSection />
                </LazySection>

                {/* Local Attractions */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[9]">
                    <section id="attractions" className="bg-white dark:bg-gray-800 py-8 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/attractions')} title={t('homepage.attractionsTitle')} description={t('homepage.attractionsDesc')} />
                            
                            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
                                {loading ? (
                                    [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                                ) : (
                                    featuredAtrakcii.map(item => (
                                        <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                                    ))
                                )}
                            </div>
                            
                            <div className="md:hidden relative slider-container-mobile">
                                <div
                                    ref={sliderRefs.atrakcii}
                                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                >
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                <SkeletonPosterCard />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {featuredAtrakcii.map((item) => (
                                                <div key={item.id} className="w-48 flex-shrink-0 snap-center">
                                                    <Card item={item} onClick={() => handleCardClick(item)} variant="poster" />
                                                </div>
                                            ))}
                                            <div className="w-48 flex-shrink-0 snap-center">
                                                <Link
                                                    to={getLocalizedPath('/attractions')}
                                                    className="flex flex-col items-center justify-center h-full bg-brand-bg-light dark:bg-gray-700 rounded-lg p-4 text-center group"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-4">
                                                        <MapTourIcon className="w-8 h-8 text-brand-accent"/>
                                                    </div>
                                                    <h3 className="text-base font-serif font-bold text-brand-text dark:text-gray-100 mb-2">{t('homepage.ctaCard.attractionsTitle')}</h3>
                                                    <span className="mt-4 bg-brand-accent/10 text-brand-accent font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 text-sm">
                                                        {t('homepage.ctaCard.exploreAllAttractions')}
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>

                {/* Wine Paradise */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[8]">
                    <section
                        className="py-8 md:py-16 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(/images/homepage-tsx/wine-paradise-background-section-background.webp)` }}
                    >
                        <div className="absolute inset-0 bg-slate-900/70"></div>
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                            <div className="hidden md:grid md:grid-cols-2 items-center gap-8 md:gap-16">
                                <div className="text-left">
                                    <div className="p-8 lg:p-12">
                                        <Link to={getLocalizedPath('/wine-paradise')} className="group block">
                                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 group-hover:text-brand-accent transition-colors duration-300 drop-shadow-md">
                                                {t('homepage.wineParadiseTitle')}
                                            </h2>
                                            <div className="w-24 h-1 bg-brand-accent rounded group-hover:w-28 transition-all duration-300"></div>
                                            <p className="text-white/80 mt-6 max-w-2xl drop-shadow">
                                                {t('homepage.wineParadiseDesc')}
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                                <div className="w-full">
                                {loading ? (
                                        <SkeletonCard />
                                ) : (
                                    featuredWineries[0] && <WineryCard item={featuredWineries[0]} onDetailsClick={() => handleCardClick(featuredWineries[0])} />
                                )}
                                </div>
                            </div>
                            
                            <div className="md:hidden">
                                <SectionHeader to={getLocalizedPath('/wine-paradise')} title={t('homepage.wineParadiseTitle')} description={t('homepage.wineParadiseDesc')} variant="dark" />
                                <div className="relative slider-container-mobile">
                                    <div
                                        ref={sliderRefs.winery}
                                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                    >
                                        {loading ? (
                                            [...Array(3)].map((_, i) => (
                                                <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                    <SkeletonPosterCard />
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                {featuredWineries.map((item) => (
                                                    <div key={item.id} className="w-48 flex-shrink-0 snap-center">
                                                        <WineryCard item={item} onDetailsClick={() => handleCardClick(item)} useFlipEffect={false} />
                                                    </div>
                                                ))}
                                                <div className="w-48 flex-shrink-0 snap-center">
                                                    <Link
                                                        to={getLocalizedPath('/wine-paradise')}
                                                        className="flex flex-col items-center justify-center h-full bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center group"
                                                    >
                                                        <div className="w-16 h-16 rounded-full bg-white/20 shadow-md flex items-center justify-center mb-4">
                                                            <GrapeIcon className="w-8 h-8 text-white"/>
                                                        </div>
                                                        <h3 className="text-base font-serif font-bold text-white mb-2">{t('homepage.ctaCard.wineryTitle')}</h3>
                                                        <span className="mt-4 bg-white/20 text-white font-bold py-2 px-4 rounded-lg group-hover:bg-white group-hover:text-brand-text transition-colors duration-300 text-sm">
                                                            {t('homepage.ctaCard.exploreAllWineries')}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>

                {/* Shopping Guide */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[7]">
                    <section id="shopping" className="bg-brand-bg-light dark:bg-gray-900 py-8 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/shopping')} title={t('homepage.shoppingGuideTitle')} description={t('homepage.shoppingGuideDesc')} />
                            
                            <div className="hidden md:grid md:grid-cols-2 gap-8">
                                {loading ? (
                                    [...Array(4)].map((_, i) => <SkeletonShoppingCard key={i} />)
                                ) : (
                                    featuredShopping.map(item => (
                                        <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                                    ))
                                )}
                            </div>
                            
                            <div className="md:hidden relative slider-container-mobile">
                                <div
                                    ref={sliderRefs.shopping}
                                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                >
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                <SkeletonPosterCard />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {featuredShopping.map((item) => (
                                                <div key={item.id} className="w-48 flex-shrink-0 snap-center">
                                                    <Card item={item} onClick={() => handleCardClick(item)} variant="poster" />
                                                </div>
                                            ))}
                                            <div className="w-48 flex-shrink-0 snap-center">
                                                <Link
                                                    to={getLocalizedPath('/shopping')}
                                                    className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg p-4 text-center group"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center mb-4">
                                                        <StoreIcon className="w-8 h-8 text-brand-accent"/>
                                                    </div>
                                                    <h3 className="text-base font-serif font-bold text-brand-text dark:text-gray-100 mb-2">{t('homepage.ctaCard.shoppingTitle')}</h3>
                                                    <span className="mt-4 bg-brand-accent/10 text-brand-accent font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 text-sm">
                                                        {t('homepage.ctaCard.exploreAllShopping')}
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>

                {/* Entertainment */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[6]">
                    <section id="entertainment" className="bg-white dark:bg-gray-800 py-8 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/entertainment')} title={t('homepage.entertainmentTitle')} description={t('homepage.entertainmentDesc')} />
                            
                            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {loading ? (
                                    [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                                ) : (
                                    featuredEntertainment.map(item => (
                                        <Card key={item.id} item={item} onClick={() => handleCardClick(item)} />
                                    ))
                                )}
                            </div>
                            
                            <div className="md:hidden relative slider-container-mobile">
                                <div
                                    ref={sliderRefs.entertainment}
                                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 space-x-4 pb-8"
                                >
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="w-48 flex-shrink-0 snap-center">
                                                <SkeletonPosterCard />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {featuredEntertainment.map((item) => (
                                                <div key={item.id} className="w-48 flex-shrink-0 snap-center">
                                                    <Card item={item} onClick={() => handleCardClick(item)} variant="poster" />
                                                </div>
                                            ))}
                                            <div className="w-48 flex-shrink-0 snap-center">
                                                <Link
                                                    to={getLocalizedPath('/entertainment')}
                                                    className="flex flex-col items-center justify-center h-full bg-brand-bg-light dark:bg-gray-700 rounded-lg p-4 text-center group"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-4">
                                                        <CasinoChipIcon className="w-8 h-8 text-brand-accent"/>
                                                    </div>
                                                    <h3 className="text-base font-serif font-bold text-brand-text dark:text-gray-100 mb-2">{t('homepage.ctaCard.entertainmentTitle')}</h3>
                                                    <span className="mt-4 bg-brand-accent/10 text-brand-accent font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 text-sm">
                                                        {t('homepage.ctaCard.exploreAllEntertainment')}
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </LazySection>

                {/* Stories Section */}
                <LazySection placeholder={<SectionSkeleton />} className="relative z-[5]">
                    <section id="stories" className="bg-brand-bg-light dark:bg-gray-900 py-8 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeader to={getLocalizedPath('/stories')} title={t('homepage.storiesTitle')} description={t('homepage.storiesDesc')} />
                            
                            <div className="hidden md:grid md:grid-cols-2 gap-8">
                            {loading ? (
                                    <>
                                        <div className="rounded-lg shadow-lg h-full min-h-[500px] bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                                        <div className="flex flex-col gap-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md h-32 animate-pulse">
                                                    <div className="w-32 bg-gray-300 dark:bg-gray-700"></div>
                                                    <div className="p-4 flex-grow flex flex-col justify-center">
                                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex-grow bg-gray-200 dark:bg-gray-800/50 rounded-lg shadow-md animate-pulse"></div>
                                        </div>
                                    </>
                                ) : firstStory ? (
                                    <>
                                        <Link to={getLocalizedPath(`/stories/${firstStory.id}`)} className="block h-full">
                                            <div className="relative h-full rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                                                <img src={firstStory.images[0]} alt={firstStory.title[lang]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                                <div className="relative p-8 flex flex-col justify-end h-full text-white">
                                                    <span className="text-sm font-bold text-brand-accent mb-2 block">{t(`categories.${firstStory.category}`)}</span>
                                                    <h3 className="text-3xl font-serif font-bold mb-4 drop-shadow-md">{firstStory.title[lang]}</h3>
                                                    <div className="flex items-center space-x-3 text-sm">
                                                        {firstStory.authorAvatar ? (
                                                            <img src={firstStory.authorAvatar} alt={firstStory.author} className="w-10 h-10 rounded-full object-cover border-2 border-white/50"/>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-600/50 flex items-center justify-center">
                                                                <UserIcon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <div className="leading-tight">
                                                            <p className="font-semibold">{firstStory.author}</p>
                                                            <p className="text-xs opacity-80">{new Date(firstStory.publicationDate).toLocaleDateString(language)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex flex-col gap-4 h-full">
                                            {otherStories.map(item => (
                                                <Link key={item.id} to={getLocalizedPath(`/stories/${item.id}`)} className="group flex bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                                                    <img src={item.images[0]} alt={item.title[lang]} className="w-24 h-auto md:w-32 object-cover transition-transform duration-500 group-hover:scale-105"/>
                                                    <div className="p-4 flex flex-col justify-center">
                                                        <h4 className="font-bold text-brand-text dark:text-gray-100 group-hover:text-brand-accent transition-colors line-clamp-2">{item.title[lang]}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(item.publicationDate).toLocaleDateString(language)}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link to={getLocalizedPath('/stories')} className="group flex-grow flex flex-col items-center justify-center bg-white dark:bg-gray-800/50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 text-center">
                                                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                                                    <LightbulbIcon className="w-7 h-7 text-brand-accent"/>
                                                </div>
                                                <p className="font-bold text-brand-text dark:text-gray-200 group-hover:text-brand-accent transition-colors">{t('homepage.ctaCard.exploreAllStories')}</p>
                                            </Link>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            
                            <div className="md:hidden">
                                {loading ? (
                                    <div>
                                        <div className="mb-6 relative rounded-lg overflow-hidden shimmer bg-gray-300 dark:bg-gray-700">
                                            <div className="aspect-w-4 aspect-h-5"></div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md h-28 animate-pulse">
                                                    <div className="w-28 bg-gray-300 dark:bg-gray-700"></div>
                                                    <div className="p-4 flex-grow flex flex-col justify-center">
                                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    firstStory && (
                                        <>
                                            <Link to={getLocalizedPath(`/stories/${firstStory.id}`)} className="block mb-6 relative group overflow-hidden rounded-lg shadow-lg">
                                                <div className="aspect-w-4 aspect-h-5">
                                                    <img src={firstStory.images[0]} alt={firstStory.title[lang]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                                    <h3 className="text-xl font-serif font-bold mb-2 drop-shadow-md">{firstStory.title[lang]}</h3>
                                                    <div className="flex items-center space-x-3 text-sm">
                                                        {firstStory.authorAvatar ? (
                                                            <img src={firstStory.authorAvatar} alt={firstStory.author} className="w-9 h-9 rounded-full object-cover border-2 border-white/50"/>
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-gray-600/50 flex items-center justify-center">
                                                                <UserIcon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <div className="leading-tight">
                                                            <p className="font-semibold">{firstStory.author}</p>
                                                            <p className="text-xs opacity-80">{new Date(firstStory.publicationDate).toLocaleDateString(language)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            {(otherStories.length > 0) && (
                                                <div className="flex flex-col gap-4">
                                                    {otherStories.map(item => (
                                                        <Link key={item.id} to={getLocalizedPath(`/stories/${item.id}`)} className="group flex bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                                                            <img src={item.images[0]} alt={item.title[lang]} className="w-24 h-auto object-cover transition-transform duration-500 group-hover:scale-105"/>
                                                            <div className="p-4 flex flex-col justify-center">
                                                                <h4 className="font-bold text-brand-text dark:text-gray-100 group-hover:text-brand-accent transition-colors line-clamp-2">{item.title[lang]}</h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(item.publicationDate).toLocaleDateString(language)}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    </section>
                </LazySection>

                <LazySection placeholder={<SectionSkeleton />}>
                    <PomosNaPatLink />
                </LazySection>
            </div>

            {selectedItem && <Modal item={selectedItem} onClose={handleCloseModal} />}
        </div>
    );
};

export default Homepage;
