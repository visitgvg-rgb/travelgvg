
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Listing, Accommodation, Restaurant, Ponuda, MultiLangString, RoomGallery, Pomos, InfoSlide } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import MapPinIcon from './icons/MapPinIcon';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import GoogleIcon from './icons/GoogleIcon';
import ClockIcon from './icons/ClockIcon';
import TagIcon from './icons/TagIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import ShareIcon from './icons/ShareIcon';
import StoreIcon from './icons/StoreIcon';
import SparklesIcon from './icons/SparklesIcon';
import { useFavorites } from '../context/FavoritesContext';
import HeartIcon from './icons/HeartIcon';
import CameraIcon from './icons/CameraIcon';
import PlateIcon from './icons/PlateIcon';
import InteriorIcon from './icons/InteriorIcon';
import GrapeIcon from './icons/GrapeIcon';
import BarrelIcon from './icons/BarrelIcon';
import WineGlassIcon from './icons/WineGlassIcon';
import NoSmokingIcon from './icons/NoSmokingIcon';
import BalconyIcon from './icons/BalconyIcon';
import PawIcon from './icons/PawIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import CasinoChipIcon from './icons/CasinoChipIcon';
import KeyIcon from './icons/KeyIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import UtensilsCrossedIcon from './icons/UtensilsCrossedIcon';
import CheckIcon from './icons/CheckIcon';
import MapTourIcon from './icons/MapTourIcon';
import SlotMachineIcon from './icons/SlotMachineIcon';
import WifiIcon from './icons/WifiIcon';
import CalendarIcon from './icons/CalendarIcon';
import TicketIcon from './icons/TicketIcon';
import GasPumpIcon from './icons/GasPumpIcon';

// Helper icons
const WebsiteIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
    </svg>
);

const WhatsappIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.74.45 3.48 1.34 5l-1.4 5.12 5.25-1.38c1.45.81 3.02 1.24 4.72 1.24 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.88 11.53c-.28.14-1.69.83-1.95.93-.26.1-.45.14-.64-.14s-.83-1-.99-1.21c-.16-.22-.35-.26-.49-.12-.14.14-.45.56-.55.68-.1.12-.2.14-.37.05-.18-.1-.75-.28-1.43-.88-.53-.47-.88-.83-1-1.18-.1-.35-.01-.54.12-.68.12-.12.26-.3.4-.45.14-.14.18-.24.28-.4s.05-.18-.02-.32c-.08-.14-.64-1.54-.88-2.1s-.48-.48-.64-.48h-.5c-.14 0-.37.05-.55.24s-.7.68-.7 1.67c0 .98.72 1.94.81 2.08.1.14 1.4 2.13 3.38 2.98.47.2.83.33 1.12.42.48.14.92.12 1.26.07.39-.05 1.21-.49 1.38-.97.18-.48.18-.88.13-.97-.05-.09-.19-.14-.44-.28z"/>
    </svg>
);

const ViberIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const StarIcon: React.FC<{ fillPercentage: number, className?: string }> = ({ fillPercentage, className = "w-5 h-5 text-yellow-400" }) => {
    const uniqueId = `star_grad_${Math.random().toString(36).substr(2, 9)}`;
    return (
        <svg className={className} fill={`url(#${uniqueId})`} viewBox="0 0 20 20">
            <defs>
                <linearGradient id={uniqueId}>
                    <stop offset={`${fillPercentage}%`} stopColor="currentColor" />
                    <stop offset={`${fillPercentage}%`} stopColor="#e5e7eb" /> {/* gray-200 */}
                </linearGradient>
            </defs>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
};

// Amenity Icons
const SimpleParkingIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5h4a3 3 0 0 1 0 6H8V5zm0 6v7" /></svg>;
const PrivateParkingIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 8h3a2 2 0 0 1 0 4H9V8zm0 4v4" /></svg>;
const ACIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const TVIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" /></svg>;
const FamilyIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
const BathroomIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18" /></svg>;
const PoolIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V15H2.25v2.25A2.25 2.25 0 0 0 4.5 19.5Zm0-4.5h15m-15-4.5h15m-15-4.5h15M6.75 21v-3.75a3 3 0 0 1 3-3h4.5a3 3 0 0 1 3 3V21" /></svg>;
const SpaIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" /></svg>;
const KitchenIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v16.5M15 3.75v16.5M13.5 3h-3m4.5 0h-6m7.5 18h-9a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5Z" /></svg>;


const convertYouTubeUrlToEmbed = (url: string | undefined): string => {
    if (!url) {
        return '';
    }
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    if (url.includes('/embed/')) {
        return url;
    }

    console.warn("Could not extract YouTube video ID from URL:", url);
    return '';
};

const checkIsOpen = (workingHoursStr: string | undefined): boolean => {
    if (!workingHoursStr) return false;
    
    // Normalize
    const normalized = workingHoursStr.toLowerCase().trim();
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
    // we assume false (Closed).
    
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

interface ModalProps {
    item: Listing | null;
    onClose: () => void;
}

const shoppingCategories = [
    'trgovski-centri', 'butici', 'obuvki', 'za-deca', 'supermarketi', 
    'apteki', 'benzinski-pumpi', 'domasni-proizvodi',
    'avto-peralni', 'rent-a-car'
];

const isAccommodation = (listing: Listing | null): listing is Accommodation => !!listing && 'amenities' in listing;
const isRestaurant = (listing: Listing | null): listing is Restaurant => !!listing && 'details' in listing && !('amenities' in listing);
const isPomos = (listing: Listing | null): listing is Pomos => {
    if (!listing || !('category' in listing)) return false;
    const pomosCategories = ['slep-sluzbi', 'avtomehanicari', 'vulkanizeri'];
    return pomosCategories.includes(listing.category);
};
const isPonuda = (listing: Listing | null): listing is Ponuda => !!listing && 'businessName' in listing;

// Check if item is specifically a Restaurant (food) to apply the live status logic
const isFoodPlace = (listing: Listing | null): boolean => {
    if (!listing) return false;
    const foodCategories = ['restorani', 'picerii', 'brza-hrana', 'zdrava-ishrana'];
    return 'category' in listing && foodCategories.includes(listing.category);
};

const isEntertainmentItem = (listing: Listing | null): boolean => {
    if (!listing) return false;
    const entCategories = ['kazina', 'klubovi', 'barovi', 'kafe-barovi'];
    return 'category' in listing && entCategories.includes(listing.category);
};

const isWineryItem = (listing: Listing): boolean => {
    if (!listing || !('category' in listing)) return false;
    const wineryCategories = ['so-degustacija', 'prodazba-na-vino'];
    return wineryCategories.includes(listing.category);
};

// Check if item is an attraction
const isAttractionItem = (listing: Listing | null): boolean => {
    if (!listing) return false;
    const attractionCategories = ['muzei', 'prirodni-ubavini', 'istoriski-lokaliteti'];
    return 'category' in listing && attractionCategories.includes(listing.category);
};

const DetailedGallery: React.FC<{ item: Accommodation | Restaurant; onClose: () => void; }> = ({ item, onClose }) => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;

    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(-1); // -1 for "All Photos"
    const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; index: number; photos: string[] }>({ isOpen: false, index: 0, photos: [] });
    const [animation, setAnimation] = useState({ key: 0, class: 'animate-zoom-slide-up' });
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const galleries = isAccommodation(item) ? (item as Accommodation).roomGalleries : (isRestaurant(item) ? (item as Restaurant).photoGalleries : []);

    const allPhotos = useMemo(() => {
        const galleryImages = galleries?.flatMap(g => g.images) || [];
        return [...new Set([...item.images, ...galleryImages])];
    }, [item.images, galleries]);

    const getIconForCategory = (title: string): React.ReactNode => {
        const lowerCaseTitle = title.toLowerCase();
        if (lowerCaseTitle.includes('food') || lowerCaseTitle.includes('храна')) return <PlateIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('ambiance') || lowerCaseTitle.includes('амбиент') || lowerCaseTitle.includes('interior') || lowerCaseTitle.includes('ентериер')) return <InteriorIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('vineyard') || lowerCaseTitle.includes('лоз')) return <GrapeIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('cellar') || lowerCaseTitle.includes('визба')) return <BarrelIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('tasting') || lowerCaseTitle.includes('дегустација')) return <WineGlassIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('collection') || lowerCaseTitle.includes('колекција') || lowerCaseTitle.includes('fashion') || lowerCaseTitle.includes('мода')) return <TagIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('store') || lowerCaseTitle.includes('продавница') || lowerCaseTitle.includes('shop') || lowerCaseTitle.includes('дуќан')) return <StoreIcon className="w-5 h-5 mr-3"/>;
        if (lowerCaseTitle.includes('party') || lowerCaseTitle.includes('забава') || lowerCaseTitle.includes('club') || lowerCaseTitle.includes('клуб') || lowerCaseTitle.includes('music') || lowerCaseTitle.includes('музика')) return <MusicNoteIcon className="w-5 h-5 mr-3"/>;
         if (lowerCaseTitle.includes('vip') || lowerCaseTitle.includes('casino') || lowerCaseTitle.includes('казино') || lowerCaseTitle.includes('игри')) return <CasinoChipIcon className="w-5 h-5 mr-3"/>;
        return null;
    };

    const categories = useMemo(() => {
        const itemGalleries = galleries || [];
        return [
            { title: t('storyDetailPage.allPhotos', { default: 'All Photos' }), photos: allPhotos, icon: <CameraIcon className="w-5 h-5 mr-3"/> },
            ...itemGalleries.map(gallery => ({
                title: gallery.title[lang],
                photos: gallery.images,
                icon: getIconForCategory(gallery.title.en)
            }))
        ];
    }, [galleries, allPhotos, lang, t]);
    
    const photosToShow = categories[activeCategoryIndex + 1]?.photos || [];
    
    const openLightbox = (index: number, photoSet: string[]) => {
        setLightboxState({ isOpen: true, index, photos: photoSet });
        setAnimation({ key: index, class: 'animate-zoom-slide-up' });
    };

    const closeLightbox = () => {
        setLightboxState({ isOpen: false, index: 0, photos: [] });
    };

    const nextImage = useCallback(() => {
        setLightboxState(prev => {
            const newIndex = (prev.index + 1) % prev.photos.length;
            setAnimation({ key: newIndex, class: 'animate-slide-in-right-full' });
            return { ...prev, index: newIndex };
        });
    }, []);

    const prevImage = useCallback(() => {
        setLightboxState(prev => {
            const newIndex = (prev.index - 1 + prev.photos.length) % prev.photos.length;
            setAnimation({ key: newIndex, class: 'animate-slide-in-left-full' });
            return { ...prev, index: newIndex };
        });
    }, []);
    
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
    
        if (distance > minSwipeDistance) {
            nextImage();
        } else if (distance < -minSwipeDistance) {
            prevImage();
        }
        setTouchStart(null);
    };

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if(lightboxState.isOpen) closeLightbox();
                else onClose();
            }
            if(lightboxState.isOpen) {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [lightboxState.isOpen, onClose, nextImage, prevImage]);
    
    const CategoryButton: React.FC<{index: number; title: string; icon?: React.ReactNode; count: number;}> = ({index, title, icon, count}) => (
        <button
            onClick={() => setActiveCategoryIndex(index)}
            className={`w-full text-left p-3 rounded-lg flex items-center justify-between text-sm transition-colors ${activeCategoryIndex === index ? 'bg-white/10 text-white font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
        >
            <span className="flex items-center truncate">
                {icon}
                <span className="truncate">{title}</span>
            </span>
            <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded flex-shrink-0">{count}</span>
        </button>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col md:flex-row text-white animate-fade-in-fast">
                <header className="md:hidden flex-shrink-0 flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700/50">
                    <h3 className="font-bold text-lg truncate">{item.title[lang]}</h3>
                    <button onClick={onClose} aria-label="Close Gallery" className="p-2 -mr-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </header>
                <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-gray-900/50 p-6 flex-shrink-0 border-r border-gray-700/50">
                    <h3 className="font-bold text-xl mb-2 truncate">{item.title[lang]}</h3>
                    <p className="text-xs text-gray-400 mb-6">{t('storyDetailPage.gallery')}</p>
                    <nav className="space-y-2 flex-grow overflow-y-auto pr-2 -mr-2 hide-scrollbar">
                        {categories.map((cat, index) => (
                           <CategoryButton key={index-1} index={index-1} title={cat.title} icon={cat.icon} count={cat.photos.length} />
                        ))}
                    </nav>
                    <button onClick={onClose} className="mt-6 text-sm text-gray-400 hover:text-white transition-colors">{t('modal.close', { default: 'Close' })}</button>
                </aside>
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8">
                        <div className="md:hidden -mx-4 px-4 overflow-x-auto hide-scrollbar mb-4">
                            <div className="flex space-x-3 pb-2">
                                {categories.map((cat, index) => (
                                    <button
                                        key={index - 1}
                                        onClick={() => setActiveCategoryIndex(index - 1)}
                                        className={`flex items-center shrink-0 gap-2 px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 ${
                                            activeCategoryIndex === index - 1
                                                ? 'bg-brand-accent text-white shadow-lg'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                        }`}
                                    >
                                        {cat.icon && React.cloneElement(cat.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
                                        <span>{cat.title}</span>
                                        <span className={`text-xs font-mono rounded-md px-1.5 py-0.5 ${
                                            activeCategoryIndex === index - 1 
                                            ? 'bg-white/25' 
                                            : 'bg-white/10'
                                        }`}>{cat.photos.length}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                            {photosToShow.map((img, index) => (
                                <div key={index} onClick={() => openLightbox(index, photosToShow)} className="aspect-w-1 aspect-h-1 bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative">
                                    <img src={img} alt={`${categories[activeCategoryIndex+1].title} ${index+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
            {lightboxState.isOpen && (
                <div 
                    className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 animate-fade-in" 
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] transition-colors" aria-label="Close">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors hidden md:flex items-center justify-center" aria-label="Previous image">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <img 
                            key={animation.key}
                            src={lightboxState.photos[lightboxState.index]} 
                            alt={`Image ${lightboxState.index + 1}`} 
                            className={`max-w-[90vw] max-h-[90vh] object-contain rounded-lg ${animation.class}`}
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-semibold">
                            {lightboxState.index + 1} / {lightboxState.photos.length}
                        </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors hidden md:flex items-center justify-center" aria-label="Next image">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </div>
            )}
        </>
    );
};

const InfoSlider: React.FC<{ slides: InfoSlide[], title: string }> = ({ slides, title }) => {
    const { language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(true);

    const handleScroll = useCallback(() => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowPrev(scrollLeft > 1);
            setShowNext(scrollWidth > clientWidth + scrollLeft + 1);
        }
    }, []);

    const scroll = (direction: 'prev' | 'next') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth * 0.8; 
            sliderRef.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); 
            return () => slider.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="mb-6">
            <h4 className="font-serif font-bold text-base md:text-lg mb-3 px-4 sm:px-0 text-brand-text dark:text-gray-100">{title}</h4>
            <div className="relative">
                <div ref={sliderRef} className="flex overflow-x-auto scroll-smooth hide-scrollbar -mx-4 px-2 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex-shrink-0 w-[60%] sm:w-[40%] lg:w-[60%] p-2 snap-center">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-700 group flex flex-col">
                                <div className="relative overflow-hidden w-full h-full">
                                    <img src={slide.image} alt={slide.text ? slide.text[lang] : `Slide ${index + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showPrev && (
                    <button onClick={() => scroll('prev')} className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-full shadow-md text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 hidden sm:block">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}
                {showNext && (
                     <button onClick={() => scroll('next')} className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-full shadow-md text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 hidden sm:block">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};

const InfoRowItem: React.FC<{ icon: React.ReactNode, label: string, value: string, extraContent?: React.ReactNode }> = ({ icon, label, value, extraContent }) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center text-left border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.01]">
        <div className="text-brand-accent mr-3 bg-brand-accent/10 p-2 rounded-full flex-shrink-0">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-0.5">{label}</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">{value}</span>
            {extraContent}
        </div>
    </div>
);

const RenderFeatureGrid: React.FC<{ features: string[], limit?: number }> = ({ features, limit }) => {
    const { t } = useTranslation();
    
    if (!features || features.length === 0) return null;

    const displayFeatures = limit ? features.slice(0, limit) : features;

    const getIcon = (feature: string) => {
        const iconClass = "w-5 h-5";
        switch(feature) {
            case 'degustacija': return <WineGlassIcon className={iconClass} />;
            case 'hrana': return <PlateIcon className={iconClass} />;
            case 'tura': return <MapTourIcon className={iconClass} />;
            case 'prodazba': return <StoreIcon className={iconClass} />;
            case '24-7': return <ClockIcon className={iconClass} />;
            case 'slot-masini': return <SlotMachineIcon className={iconClass} />;
            case 'igri-vo-zivo': return <CasinoChipIcon className={iconClass} />;
            case 'muzika-vo-zivo': return <MusicNoteIcon className={iconClass} />;
            case 'wifi': return <WifiIcon className={iconClass} />;
            default: return <CheckIcon className={iconClass} />;
        }
    };

    return (
        <div className="mb-6">
            <h4 className="font-serif font-bold text-base md:text-lg mb-3 dark:text-gray-200">{t('modal.amenities')}</h4>
            <div className="grid grid-cols-2 gap-3">
                {displayFeatures.map(feature => (
                    <div key={feature} className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.01]">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-brand-accent shadow-sm mr-3 flex-shrink-0">
                            {getIcon(feature)}
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight">
                            {t(`features.${feature}`)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ParsedAccommodationDescription: React.FC<{ text: string, showDetails?: boolean }> = ({ text, showDetails = true }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const parts = text.split('✨');
    
    if (parts.length < 2) {
        return <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line font-medium">{text}</p>;
    }

    const introText = parts[0].trim();
    const rest = parts[1];
    
    const infoBlockEndIndex = rest.indexOf('\n\n');
    let infoBlockString = "";
    let detailedDesc = "";

    if (infoBlockEndIndex !== -1) {
        infoBlockString = rest.substring(0, infoBlockEndIndex);
        detailedDesc = rest.substring(infoBlockEndIndex).trim();
    } else {
        infoBlockString = rest;
    }

    const infoLines = infoBlockString.split('\n').filter(line => line.trim().startsWith('◆'));
    
    const gridItems = infoLines.map(line => {
        const content = line.replace('◆', '').trim();
        const colonIndex = content.indexOf(':');
        if (colonIndex === -1) return null;
        
        const label = content.substring(0, colonIndex).trim();
        const value = content.substring(colonIndex + 1).trim();
        
        let icon = <ClockIcon className="w-5 h-5" />;
        
        const labelLower = label.toLowerCase();
        if (labelLower.includes('check-in')) icon = <ClockIcon className="w-5 h-5" />;
        else if (labelLower.includes('check-out')) icon = <ClockIcon className="w-5 h-5" />;
        else if (labelLower.includes('key') || labelLower.includes('клуч') || labelLower.includes('ključ') || labelLower.includes('κλειδι')) icon = <KeyIcon className="w-5 h-5" />;
        else if (labelLower.includes('payment') || labelLower.includes('плаќање') || labelLower.includes('plaćanje') || labelLower.includes('πληρωμή')) icon = <CreditCardIcon className="w-5 h-5" />;

        return { label, value, icon };
    }).filter(Boolean);

    return (
        <div className="mb-6">
            {introText && (
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line font-medium">
                    {introText}
                </p>
            )}
            
            {showDetails && (
                <div className="flex flex-col gap-4 mb-6">
                    {gridItems.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {gridItems.map((item, idx) => (
                                <InfoRowItem key={idx} icon={item!.icon} label={item!.label} value={item!.value} />
                            ))}
                        </div>
                    )}

                    {detailedDesc && (
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-3 flex items-center justify-between text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <div className="flex items-center">
                                    <div className="text-brand-accent mr-3 bg-brand-accent/10 p-2 rounded-full flex-shrink-0">
                                        <SparklesIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                                        {t('modal.information')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-brand-accent uppercase">
                                        {isExpanded ? t('modal.close') : t('storyDetailPage.readMore')}
                                    </span>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                    <div className="p-4 text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm md:text-base leading-relaxed">
                                        {detailedDesc}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ParsedRestaurantDescription: React.FC<{ 
    text: string, 
    workingHours?: string, 
    showOpenStatus?: boolean,
    showDetails?: boolean 
}> = ({ text, workingHours, showOpenStatus, showDetails = true }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHoursExpanded, setIsHoursExpanded] = useState(false);

    const parts = text.split('✨');
    
    // Parse working hours string from JSON if available
    const parsedSchedule = useMemo(() => {
        if (!workingHours) return [];
        return workingHours.split('\n').map(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const firstColonIndex = line.indexOf(':');
                const days = line.substring(0, firstColonIndex).trim();
                const hours = line.substring(firstColonIndex + 1).trim();
                return { days, hours };
            }
            return { days: line, hours: '' };
        });
    }, [workingHours]);
    
    const isOpen = showOpenStatus && workingHours ? checkIsOpen(workingHours) : null;

    if (parts.length < 2) {
        return <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">{text}</p>;
    }

    const introText = parts[0].trim();
    const rest = parts[1];
    
    const infoBlockEndIndex = rest.indexOf('\n\n');
    let infoBlockString = "";
    let detailedDesc = "";

    if (infoBlockEndIndex !== -1) {
        infoBlockString = rest.substring(0, infoBlockEndIndex);
        detailedDesc = rest.substring(infoBlockEndIndex).trim();
    } else {
        infoBlockString = rest;
    }

    const infoLines = infoBlockString.split('\n').filter(line => line.trim().startsWith('◆'));
    
    const gridItems = infoLines.map(line => {
        const content = line.replace('◆', '').trim();
        const colonIndex = content.indexOf(':');
        if (colonIndex === -1) return null;
        
        const label = content.substring(0, colonIndex).trim();
        const value = content.substring(colonIndex + 1).trim();
        
        let icon = <SparklesIcon className="w-5 h-5" />; // Default icon

        const labelLower = label.toLowerCase();
        if (labelLower.includes('cuisine') || labelLower.includes('кујна') || labelLower.includes('kuhinja') || labelLower.includes('κουζίνα')) icon = <UtensilsCrossedIcon className="w-5 h-5" />;
        else if (labelLower.includes('ambiance') || labelLower.includes('амбиент') || labelLower.includes('ambijent') || labelLower.includes('ατμόσφαιρα')) icon = <InteriorIcon className="w-5 h-5" />;
        else if (labelLower.includes('amenities') || labelLower.includes('погодности') || labelLower.includes('pogodnosti') || labelLower.includes('παροχές')) icon = <CheckIcon className="w-5 h-5" />;
        else if (labelLower.includes('price') || labelLower.includes('цена') || labelLower.includes('cena') || labelLower.includes('τιμή')) icon = <TagIcon className="w-5 h-5" />;

        return { label, value, icon };
    }).filter(Boolean);

    return (
        <div className="mb-6">
            {introText && (
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line font-medium">
                    {introText}
                </p>
            )}
            
            <div className="flex flex-col gap-2 mb-6">
                {showDetails && gridItems.length > 0 && gridItems.map((item, idx) => (
                    <InfoRowItem key={idx} icon={item!.icon} label={item!.label} value={item!.value} />
                ))}
                
                {parsedSchedule.length > 0 && showDetails && (
                    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setIsHoursExpanded(!isHoursExpanded)}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-3 flex items-center justify-between text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <div className="flex items-center">
                                <div className="text-brand-accent mr-3 bg-brand-accent/10 p-2 rounded-full flex-shrink-0">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    {isOpen !== null ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                                                {t('details.working_hours')}:
                                            </span>
                                            <span className={`text-sm font-bold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                                {isOpen ? t('status.open') : t('status.closed')}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                                                {t('details.working_hours')}:
                                            </span>
                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight group-hover:text-brand-accent transition-colors">
                                                {t('modal.viewSchedule')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isHoursExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`grid transition-all duration-300 ease-in-out ${isHoursExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden bg-white dark:bg-gray-900">
                                <div className="p-3 space-y-2 text-sm">
                                    {parsedSchedule.map((slot, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2 last:pb-0 pt-1 last:pt-1">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{slot.days}</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{slot.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {detailedDesc && showDetails && (
                    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-3 flex items-center justify-between text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <div className="flex items-center">
                                <div className="text-brand-accent mr-3 bg-brand-accent/10 p-2 rounded-full flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                                    {t('modal.information')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-brand-accent uppercase">
                                    {isExpanded ? t('modal.close') : t('storyDetailPage.readMore')}
                                </span>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                <div className="p-4 text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm md:text-base leading-relaxed">
                                    {detailedDesc}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
    const { t, language } = useTranslation();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const lang = language as keyof MultiLangString;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isFullScreenMobile, setIsFullScreenMobile] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [showCopied, setShowCopied] = useState(false);
    const [isDetailedGalleryOpen, setIsDetailedGalleryOpen] = useState(false);

    const itemContact = (item?.contact as any);
    const itemVideo = (item as any)?.video;
    const embedVideoUrl = convertYouTubeUrlToEmbed(itemVideo);
    
    // Updated isShoppingItem logic by updating the category list
    const isAccom = isAccommodation(item);
    const isFood = isFoodPlace(item);
    const isWinery = item ? isWineryItem(item) : false;
    const isPonudaItem = isPonuda(item);
    const isShoppingItem = (listing: Listing): boolean => 'category' in listing && shoppingCategories.includes(listing.category);
    const isEntertainment = isEntertainmentItem(item);
    const isAttraction = isAttractionItem(item);
    
    // Dynamic Button Colors
    let actionButtonColor = 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'; // Default
    // Update local isShopping variable to use the same category list for button color consistency
    const isShopping = item && 'category' in item && shoppingCategories.includes(item.category);

    if (isPonudaItem) actionButtonColor = 'bg-purple-600 text-white hover:bg-purple-700';
    else if (isFood) actionButtonColor = 'bg-green-600 text-white hover:bg-green-700';
    else if (isShopping) actionButtonColor = 'bg-blue-600 text-white hover:bg-blue-700';
    else if (isEntertainment) actionButtonColor = 'bg-rose-600 text-white hover:bg-rose-700';
    else if (isAccom) actionButtonColor = 'bg-brand-accent text-white hover:bg-orange-600';
    else if (isWinery) actionButtonColor = 'bg-red-800 text-white hover:bg-red-900';
    else if (isAttraction) actionButtonColor = 'bg-teal-600 text-white hover:bg-teal-700';

    
    const showLiveStatus = (isFood || isEntertainment) && item?.package !== 'free';
    const workingHours = (item as Restaurant)?.details?.working_hours?.[lang];
    const isOpen = (showLiveStatus && workingHours) ? checkIsOpen(workingHours) : null;

    const activeImage = item?.images?.[activeImageIndex] || '';
    const minSwipeDistance = 50;
    
    useEffect(() => {
        if (item) {
            document.body.classList.add('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [item]);

    // ... (Meta tags useEffect remains unchanged)
    
    useEffect(() => {
        if (item) {
            setActiveImageIndex(0);
            setIsZoomed(false);
            setIsFullScreenMobile(false);
            setIsDetailedGalleryOpen(false);
        }
    }, [item]);

    const hasDetailedGallery =
        (isAccommodation(item) &&
            item.package === 'premium' &&
            (item as Accommodation).roomGalleries &&
            (item as Accommodation).roomGalleries!.length > 0) ||
        (isRestaurant(item) &&
            item.package === 'premium' &&
            (item as Restaurant).photoGalleries &&
            (item as Restaurant).photoGalleries!.length > 0);


    // ... (interaction handlers remain unchanged)
    const handleImageClick = (index: number) => {
        if (hasDetailedGallery) {
            setIsDetailedGalleryOpen(true);
        } else {
            setActiveImageIndex(index);
            if (window.innerWidth < 1024) {
                setIsFullScreenMobile(true);
            } else {
                setIsZoomed(true);
            }
        }
    };

    const navigateNext = useCallback(() => {
        if (!item || !item.images || item.images.length <= 1) return;
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % item.images!.length);
    }, [item]);

    const navigatePrev = useCallback(() => {
        if (!item || !item.images || item.images.length <= 1) return;
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + item.images!.length) % item.images!.length);
    }, [item]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;
    
        if (distance > minSwipeDistance) {
            navigateNext();
        } else if (distance < -minSwipeDistance) {
            navigatePrev();
        }
        setTouchStart(null);
    };

    const handlePrevClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigatePrev();
    };

    const handleNextClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigateNext();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (isDetailedGalleryOpen) {
                    setIsDetailedGalleryOpen(false);
                } else if (isFullScreenMobile) {
                    setIsFullScreenMobile(false);
                } else if (isZoomed) {
                    setIsZoomed(false);
                } else {
                    onClose();
                }
            }
            if (isZoomed || isFullScreenMobile) {
                if (event.key === 'ArrowRight') navigateNext();
                if (event.key === 'ArrowLeft') navigatePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, isZoomed, isFullScreenMobile, isDetailedGalleryOpen, navigateNext, navigatePrev]);

    if (!item) return null;

    const generateDirectionsUrl = (mapSrc: string, title: string): string => {
        const queryMatch = mapSrc.match(/query=([^&]+)/);
        if (queryMatch && queryMatch[1]) {
            return `https://www.google.com/maps/search/?api=1&query=${queryMatch[1]}`;
        }
        const placeNameMatch = mapSrc.match(/!2s([^!]+)/);
        if (placeNameMatch && placeNameMatch[1]) {
            const decodedName = decodeURIComponent(placeNameMatch[1].replace(/\+/g, ' '));
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(decodedName)}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;
    };

    const thisItemIsFavorite = isFavorite(item.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (thisItemIsFavorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item.id);
        }
    };

    // ... (Sharing and touch handlers remain unchanged)
    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!item) return;
    
        const getCategoryPath = (item: Listing): string => {
            if ('businessName' in item) return '/special-offers';
            if ('publicationDate' in item) return '/stories';
            if (!('category' in item)) return '/';
    
            const { category } = item;
            const paths: { path: string, categories: string[] }[] = [
                { path: '/accommodation', categories: ['hoteli', 'apartmani', 'studija', 'vili', 'sobi'] },
                { path: '/restaurants', categories: ['restorani', 'picerii', 'brza-hrana', 'zdrava-ishrana'] },
                { path: '/shopping', categories: ['trgovski-centri', 'butici', 'obuvki', 'za-deca', 'supermarketi', 
        'apteki', 'benzinski-pumpi', 'domasni-proizvodi'] },
                { path: '/entertainment', categories: ['kazina', 'klubovi', 'barovi', 'kafe-barovi'] },
                { path: '/attractions', categories: ['muzei', 'prirodni-ubavini', 'istoriski-lokaliteti'] },
                { path: '/wine-paradise', categories: ['so-degustacija', 'prodazba-na-vino'] },
            ];
            
            const found = paths.find(p => p.categories.includes(category));
            return found ? found.path : '/';
        };
    
        const path = getCategoryPath(item);
        const shareUrl = `${window.location.origin}${path}?open=${item.id}`;
        
        const shareData = {
            title: item.title[lang],
            text: item.description[lang],
            url: shareUrl,
        };
    
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2500);
            }).catch(err => {
                console.error('Failed to copy URL:', err);
                alert(t('modal.shareError'));
            });
        }
    };
    
    const renderRating = () => {
        // ... (Render Rating logic unchanged)
        if (!item?.rating) return null;
        const { score, reviews, ratingSource } = item.rating;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            let fill = 0;
            if (i <= score) {
                fill = 100;
            } else if (i - 1 < score) {
                fill = (score - (i - 1)) * 100;
            }
            stars.push(<StarIcon key={i} fillPercentage={fill} className="w-4 h-4 text-yellow-400" />);
        }
        
        return (
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4 mt-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{score.toFixed(1)}</span>
                <div className="flex -space-x-0.5">{stars}</div>
                <span>({reviews} {t('modal.reviews')})</span>
                
                {ratingSource === 'google' && (
                     <div className="flex items-center space-x-1 ml-1 text-gray-500 dark:text-gray-400">
                        <span className="text-gray-300 dark:text-gray-600 mr-1">•</span>
                        <GoogleIcon className="w-3 h-3 grayscale opacity-70" />
                        <span>Google Reviews</span>
                    </div>
                )}
            </div>
        );
    };

    const renderConnectSection = () => {
        // ... (Connect Section logic unchanged)
        const showFacebook = !!itemContact?.facebook && (item.package === 'standard' || item.package === 'premium');
        const showInstagram = !!itemContact?.instagram && (item.package === 'standard' || item.package === 'premium');
        const hasWebsite = item.package === 'premium' && itemContact?.website;

        if (!showFacebook && !showInstagram && !hasWebsite) return null;

        return (
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {showFacebook && (
                        <a href={itemContact.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full" aria-label="Facebook">
                            <FacebookIcon className="w-6 h-6" />
                        </a>
                    )}
                    {showInstagram && (
                         <a href={itemContact.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-pink-600 transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full" aria-label="Instagram">
                            <InstagramIcon className="w-6 h-6" />
                        </a>
                    )}
                </div>

                {hasWebsite && (
                    <a 
                        href={itemContact.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${actionButtonColor} font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm shadow-md`}
                    >
                        <WebsiteIcon className="w-4 h-4" />
                        {isAccommodation(item) ? t('modal.bookNow') : t('modal.visitWebsite')}
                    </a>
                )}
            </div>
        );
    };
    
    // ... (renderAmenity, renderShoppingDetail, renderWineryDetail unchanged)
    const renderAmenity = (amenityKey: string) => {
        let icon: React.ReactNode = null;
        const iconClass = "w-5 h-5 text-brand-accent flex-shrink-0";

        switch(amenityKey) {
            case 'private_parking':
                icon = <PrivateParkingIcon className={iconClass} />;
                break;
            case 'parking':
            case 'free_parking':
                icon = <SimpleParkingIcon className={iconClass} />;
                break;
            case 'wifi':
                icon = <WifiIcon className={iconClass} />;
                break;
            case 'air_conditioning':
                icon = <ACIcon className={iconClass} />;
                break;
            case 'tv_flat_screen':
                icon = <TVIcon className={iconClass} />;
                break;
            case 'family_rooms':
                icon = <FamilyIcon className={iconClass} />;
                break;
            case 'private_bathroom':
                icon = <BathroomIcon className={iconClass} />;
                break;
            case 'pool':
                icon = <PoolIcon className={iconClass} />;
                break;
            case 'spa_center':
                icon = <SpaIcon className={iconClass} />;
                break;
            case 'pets_allowed':
                icon = <PawIcon className={iconClass} />;
                break;
            case 'kitchen':
                icon = <KitchenIcon className={iconClass} />;
                break;
            case 'non_smoking_rooms':
                icon = <NoSmokingIcon className={iconClass} />;
                break;
            case 'balcony_terrace':
                icon = <BalconyIcon className={iconClass} />;
                break;
            default:
                icon = <CheckIcon className={iconClass} />;
        }

        return (
            <div key={amenityKey} className="flex items-center space-x-3">
                {icon}
                <span className="text-gray-700 dark:text-gray-300 text-sm">{t(`amenities.${amenityKey}`)}</span>
            </div>
        );
    };

    const renderShoppingDetail = (label: string, value: MultiLangString | undefined, icon: React.ReactNode) => {
        if (!value || !value[lang]) return null;
        return (
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 text-brand-accent mt-0.5">{icon}</div>
                <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                    <p className="text-gray-800 dark:text-gray-100 font-semibold">{value[lang]}</p>
                </div>
            </div>
        );
    };
    
    const renderWineryDetail = (label: string, value: MultiLangString | undefined, icon: React.ReactNode) => {
        if (!value || !value[lang]) return null;
        return (
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 text-brand-accent mt-0.5">{icon}</div>
                <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
                    <p className="text-gray-800 dark:text-gray-100 font-semibold">{value[lang]}</p>
                </div>
            </div>
        );
    };


    const isRestaurantItem = (listing: Listing): listing is Restaurant => 'details' in listing && !('businessName' in listing);
    const isPomosItem = isPomos(item);

    const applyOverlapStyle = isAccom || isFood || isShoppingItem(item) || isPomosItem || isPonuda(item) || isWinery || isEntertainment || isAttraction;

    const isStandardOrPremium = item.package === 'standard' || item.package === 'premium';
    const hasViber = (isStandardOrPremium || isPonudaItem) && itemContact?.viber;
    const hasWhatsapp = (isStandardOrPremium || isPonudaItem) && itemContact?.whatsapp;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-0 lg:p-4 animate-fade-in"
                onClick={onClose}
            >
                <div 
                    className={`${(applyOverlapStyle) ? 'bg-brand-bg-light dark:bg-slate-900 lg:bg-white lg:dark:bg-slate-900' : 'bg-white dark:bg-slate-900'} rounded-none lg:rounded-lg shadow-2xl w-full h-full lg:w-full lg:max-w-4xl lg:max-h-[90vh] overflow-y-auto relative animate-slide-up hide-scrollbar`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-0">
                        {/* Image Gallery */}
                        <div className="lg:sticky lg:top-0">
                             {/* Mobile Gallery (omitted logic change, keeping structure) */}
                            <div
                                className="block lg:hidden relative"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                <button 
                                    onClick={onClose}
                                    className="absolute top-4 left-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                                    aria-label={t('modal.close')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                                    <button 
                                        onClick={handleShare}
                                        className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                                        aria-label={t('modal.share')}
                                    >
                                        <ShareIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={handleFavoriteClick}
                                        className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                                    >
                                        <HeartIcon className={`w-6 h-6 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                                    </button>
                                </div>

                                {activeImage && <img
                                    key={activeImage}
                                    src={activeImage}
                                    alt={item.title[lang]}
                                    onClick={() => handleImageClick(activeImageIndex)}
                                    className="w-full aspect-[4/3] object-cover animate-gallery-fade-in cursor-pointer"
                                />}
                                {item.images && item.images.length > 1 && (
                                    <div className={`absolute ${ (applyOverlapStyle) ? 'bottom-10' : 'bottom-4'} right-4 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full z-10`}>
                                        {activeImageIndex + 1} / {item.images.length}
                                    </div>
                                )}
                                {hasDetailedGallery && (
                                    <button
                                        onClick={() => setIsDetailedGalleryOpen(true)}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold hover:bg-black/70 transition-colors whitespace-nowrap"
                                    >
                                        <CameraIcon className="w-4 h-4" />
                                        {t('modal.viewGallery')}
                                    </button>
                                )}
                            </div>

                            {/* Desktop Gallery */}
                            <div className="p-4 sm:p-6 hidden lg:block">
                                <div className="mb-4 relative rounded-lg overflow-hidden">
                                    <button 
                                        onClick={onClose}
                                        className="absolute top-4 left-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                                        aria-label={t('modal.close')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                                        <button 
                                            onClick={handleShare}
                                            className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                                            aria-label={t('modal.share')}
                                        >
                                            <ShareIcon className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={handleFavoriteClick}
                                            className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                                            aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                                        >
                                            <HeartIcon className={`w-6 h-6 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                                        </button>
                                    </div>

                                    {activeImage && <img
                                        key={activeImage}
                                        src={activeImage}
                                        alt={item.title[lang]}
                                        onClick={() => handleImageClick(activeImageIndex)}
                                        className="w-full h-80 object-cover rounded-lg shadow-md cursor-pointer animate-gallery-fade-in"
                                    />}
                                    {item.images && item.images.length > 1 && (
                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                                            {activeImageIndex + 1} / {item.images.length}
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                                    {item.images?.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${item.title[lang]} thumbnail ${index + 1}`}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${activeImageIndex === index ? 'border-brand-accent' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                                        />
                                    ))}
                                </div>
                                {hasDetailedGallery && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setIsDetailedGalleryOpen(true)}
                                            className="w-full bg-brand-accent/10 text-brand-accent font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-white transition-colors duration-300 dark:bg-brand-accent/20 dark:hover:bg-brand-accent dark:text-orange-300 dark:hover:text-white"
                                        >
                                            <CameraIcon className="w-5 h-5" />
                                            {t('modal.viewGallery')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Details Section */}
                        <div className={`flex flex-col p-4 sm:p-6 ${ (applyOverlapStyle) ? 'bg-white dark:bg-slate-900 rounded-t-3xl -mt-8 pt-8 lg:mt-0 lg:rounded-none lg:pt-6 lg:bg-transparent dark:lg:bg-transparent relative' : ''}`}>
                            
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-brand-text dark:text-gray-100 mb-1 leading-tight flex items-center">
                                {isPonuda(item) ? (item as Ponuda).businessName[lang] : item.title[lang]}
                                {isOpen !== null && item.package !== 'free' && (
                                    <span 
                                        className={`ml-3 w-3 h-3 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                                        title={isOpen ? t('status.open') : t('status.closed')}
                                    ></span>
                                )}
                            </h2>
                            
                            {/* Special Layout for Attractions (Travel Guide Style) */}
                            {isAttraction ? (
                                <div className="mt-2 mb-6">
                                    <span className="inline-block bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                        {t(`categories.${item.category}`)}
                                    </span>
                                    
                                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base whitespace-pre-line leading-relaxed mb-6">
                                        {item.description[lang]}
                                    </p>

                                    {/* Travel Guide Info Card */}
                                    <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl p-4 mb-6">
                                        <h4 className="text-xs font-bold text-teal-800 dark:text-teal-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <SparklesIcon className="w-4 h-4"/> {t('modal.information')}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {(item as any).details?.ticket?.[lang] && (
                                                <div className="flex items-start gap-2">
                                                    <TicketIcon className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0"/>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-gray-500 font-bold block">{t('details.ticket')}</span>
                                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{(item as any).details.ticket[lang]}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {(item as any).details?.working_hours?.[lang] && (
                                                <div className="flex items-start gap-2">
                                                    <ClockIcon className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0"/>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-gray-500 font-bold block">{t('details.working_hours')}</span>
                                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{(item as any).details.working_hours[lang]}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {(item as any).details?.period?.[lang] && (
                                                <div className="flex items-start gap-2 col-span-2 border-t border-teal-200 dark:border-teal-800 pt-3 mt-1">
                                                    <div className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0 flex items-center justify-center font-serif font-bold text-xs border border-teal-600 rounded-full">i</div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-gray-500 font-bold block">{t('details.period')}</span>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300 italic">{(item as any).details.period[lang]}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : isPonuda(item) ? (
                                <div className="mt-2 mb-6">
                                    <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                        {item.title[lang]}
                                    </span>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base whitespace-pre-line leading-relaxed">
                                        {item.description[lang]}
                                    </p>
                                    
                                    {/* Voucher / Coupon Style Block */}
                                    <div className="mt-6 border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10 rounded-xl p-5 relative overflow-hidden">
                                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full"></div>
                                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full"></div>
                                        
                                        <h4 className="text-sm font-bold text-purple-800 dark:text-purple-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <TicketIcon className="w-5 h-5"/> {t('modal.offerDetails')}
                                        </h4>
                                        
                                        <div className="space-y-4">
                                            {(item as Ponuda).details['valid_until'] && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-purple-600 shadow-sm flex-shrink-0">
                                                        <CalendarIcon className="w-5 h-5"/>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t('details.valid_until')}</span>
                                                        <p className="text-base font-bold text-gray-800 dark:text-gray-100">{(item as Ponuda).details['valid_until'][lang]}</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {(item as Ponuda).details['how_to_use'] && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-purple-600 shadow-sm flex-shrink-0">
                                                        <CheckIcon className="w-5 h-5"/>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t('details.how_to_use')}</span>
                                                        <p className="text-base font-bold text-gray-800 dark:text-gray-100">{(item as Ponuda).details['how_to_use'][lang]}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {(item as Ponuda).details['conditions'] && (
                                                <div className="pt-3 border-t border-purple-200 dark:border-purple-800/30">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                        <strong>{t('details.conditions')}:</strong> {(item as Ponuda).details['conditions'][lang]}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {isAccommodation(item) && item.priceFrom && item.currency && item.priceFrom[lang] && (
                                        <div className="mb-2 flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{t('accommodationCard.priceFrom')}</span>
                                            <span className="text-3xl font-black text-brand-accent leading-none">
                                                {new Intl.NumberFormat().format(item.priceFrom[lang])} <span className="text-xl">{item.currency[lang]}</span>
                                            </span>
                                        </div>
                                    )}

                                    {renderRating()}
                                    
                                    {/* Render Description */}
                                    {isAccommodation(item) ? (
                                        <ParsedAccommodationDescription 
                                            text={item.description[lang]}
                                            showDetails={item.package !== 'free'} 
                                        />
                                    ) : isRestaurant(item) && !isWinery ? (
                                        <ParsedRestaurantDescription 
                                            text={item.description[lang]} 
                                            workingHours={(item as Restaurant).details?.working_hours?.[lang]} 
                                            showOpenStatus={(isFood || isEntertainment) && item.package !== 'free'}
                                            showDetails={item.package !== 'free'}
                                        />
                                    ) : isWinery ? (
                                        <p className={`text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line ${item.package === 'free' ? 'line-clamp-3' : ''}`}>{item.description[lang]}</p>
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">{item.description[lang]}</p>
                                    )}
                                    
                                    {isAccommodation(item) && item.priceFrom && item.currency && item.priceFrom[lang] && (
                                        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl flex items-start gap-3 border border-orange-100 dark:border-orange-800/30 shadow-sm">
                                            <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-brand-accent mt-0.5">
                                                <TagIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{t('modal.priceNoteTitle')}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {t('modal.priceNoteText', { price: new Intl.NumberFormat().format(item.priceFrom[lang]), currency: item.currency[lang] })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {renderConnectSection()}

                            {'infoSlides' in item && item.infoSlides && item.infoSlides.length > 0 && item.package !== 'free' && <InfoSlider slides={item.infoSlides} title={t('modal.quickView')} />}

                            {(isAccom || isRestaurantItem(item) || isShoppingItem(item)) && <hr className="mb-6 border-gray-200 dark:border-gray-700" />}


                            {isAccommodation(item) && item.package !== 'free' && (
                                <div className="mb-6">
                                    <h4 className="font-serif font-bold text-base md:text-lg mb-3 dark:text-gray-200">{t('modal.amenities')}</h4>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        {(item as Accommodation).amenities.map(amenityKey => renderAmenity(amenityKey))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Modernized Features Grid for Wineries and Restaurants (Entertainment) */}
                            {((isWinery && item.package !== 'free') || (isRestaurant(item) && (item as Restaurant).features && (item as Restaurant).features!.length > 0)) && (
                                <RenderFeatureGrid features={(item as Restaurant).features || []} />
                            )}

                            {isShoppingItem(item) && 'details' in item && (
                                <div className="mb-6">
                                    <h4 className="font-serif font-bold text-base md:text-lg mb-4 dark:text-gray-200">{t('modal.information')}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                                        {renderShoppingDetail(t('details.store_type'), (item as Restaurant).details['store_type'], <StoreIcon className="w-full h-full" />)}
                                        {renderShoppingDetail(t('details.working_hours'), (item as Restaurant).details['working_hours'], <ClockIcon className="w-full h-full" />)}
                                        {renderShoppingDetail(t('details.brands'), (item as Restaurant).details['brands'], <SparklesIcon className="w-full h-full" />)}
                                        {renderShoppingDetail(t('details.tax_free'), (item as Restaurant).details['tax_free'], <TagIcon className="w-full h-full" />)}
                                        {renderShoppingDetail(t('details.card_payment'), (item as Restaurant).details['card_payment'], <CreditCardIcon className="w-full h-full" />)}
                                        {renderShoppingDetail(t('details.fuel_types'), (item as Restaurant).details['fuel_types'], <GasPumpIcon className="w-full h-full" />)}
                                        {renderShoppingDetail(t('details.services'), (item as Restaurant).details['services'], <CheckIcon className="w-full h-full" />)}
                                    </div>
                                </div>
                            )}
                            {isWinery && item.package !== 'free' && 'details' in item && (
                                <div className="mb-6">
                                    <h4 className="font-serif font-bold text-base md:text-lg mb-4 dark:text-gray-200">{t('modal.details')}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                                        {renderWineryDetail(t('details.wine_types'), (item as Restaurant).details['wine_types'], <GrapeIcon className="w-full h-full" />)}
                                        {renderWineryDetail(t('details.wine_tasting'), (item as Restaurant).details['wine_tasting'], <WineGlassIcon className="w-full h-full" />)}
                                        {renderWineryDetail(t('details.food_offer'), (item as Restaurant).details['food_offer'], <PlateIcon className="w-full h-full" />)}
                                        {renderWineryDetail(t('details.winery_tour'), (item as Restaurant).details['winery_tour'], <MapTourIcon className="w-full h-full" />)}
                                    </div>
                                </div>
                            )}
                            
                            <div className="lg:mt-auto">
                                <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm lg:static lg:bg-transparent dark:lg:bg-transparent lg:backdrop-blur-none border-t border-gray-200 dark:border-gray-700 lg:border-t-0 py-3 px-4 lg:p-0 -mx-4 lg:mx-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:shadow-none">
                                    <div className="flex flex-col gap-3 w-full">
                                        {/* Phone/Action Button - Different for Attractions */}
                                        {isAttraction ? (
                                             <a 
                                                href={generateDirectionsUrl(item.mapSrc, item.title[lang])}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={`w-full flex items-center justify-center ${actionButtonColor} font-black py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200`}
                                            >
                                                <MapPinIcon className="w-5 h-5 mr-2" />
                                                <span className="uppercase tracking-wide text-sm">{t('modal.getDirections')}</span>
                                            </a>
                                        ) : item.contact.phone && (
                                            <a href={`tel:${item.contact.phone}`} className={`w-full flex items-center justify-center ${actionButtonColor} font-black py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200`}>
                                                <PhoneIcon className="w-5 h-5 mr-2" />
                                                <span className="uppercase tracking-wide text-sm">{t('modal.call')}</span>
                                            </a>
                                        )}

                                        {/* Messaging Buttons Row */}
                                        {(hasViber || hasWhatsapp) && (
                                            <div className="flex flex-row gap-3 w-full">
                                                {/* Viber */}
                                                {hasViber && (
                                                    <a href={`viber://chat?number=${itemContact.viber.replace(/\+/g, '')}`} className="flex-1 flex items-center justify-center bg-[#7360f2] text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 hover:bg-[#6655d8]" aria-label="Viber">
                                                        <ViberIcon className="w-6 h-6 mr-2" />
                                                        <span className="font-bold">Viber</span>
                                                    </a>
                                                )}

                                                {/* WhatsApp */}
                                                {hasWhatsapp && (
                                                    <a href={`https://wa.me/${itemContact.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center bg-[#25D366] text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 hover:bg-[#20bd5a]" aria-label="WhatsApp">
                                                        <WhatsappIcon className="w-6 h-6 mr-2" />
                                                        <span className="font-bold">WhatsApp</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Secondary Phone Button for Attractions if Phone Exists */}
                                        {isAttraction && item.contact.phone && (
                                             <a href={`tel:${item.contact.phone}`} className="flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold py-2 hover:text-teal-600 transition-colors">
                                                <PhoneIcon className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{t('modal.call')}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {item.package === 'premium' && embedVideoUrl && (
                        <div className="p-4 sm:p-6 border-t dark:border-gray-700 mt-4">
                            <h4 className="font-serif font-bold text-base md:text-lg mb-4 flex items-center text-brand-text dark:text-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-brand-accent" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg> 
                                {t('modal.video')}
                            </h4>
                            <div className="rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    src={embedVideoUrl}
                                    className="w-full aspect-video"
                                    style={{ border: 0 }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen={true}
                                    title="Video presentation"
                                ></iframe>
                            </div>
                        </div>
                    )}


                    {/* Map Section */}
                    {item.mapSrc && (
                        <div className="mt-4 lg:rounded-b-lg overflow-hidden">
                             <div className="p-4 sm:p-6 pt-0 sm:pt-0 lg:pt-6 border-t dark:border-gray-700">
                                <h4 className="font-serif font-bold text-base md:text-lg flex items-center text-brand-text dark:text-gray-100">
                                    <MapPinIcon className="w-5 h-5 mr-2 text-brand-accent"/> {t('modal.location')}
                                </h4>
                            </div>
                            <div className="relative w-full h-64 md:h-80">
                                <iframe
                                    src={item.mapSrc}
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Location Map"
                                ></iframe>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                    <a 
                                        href={generateDirectionsUrl(item.mapSrc, item.title[lang])}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white dark:bg-gray-800 text-brand-text dark:text-gray-200 font-bold py-3 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-lg flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                        {t('modal.getDirections')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isDetailedGalleryOpen && (isAccommodation(item) || isRestaurant(item)) && <DetailedGallery item={item as Accommodation | Restaurant} onClose={() => setIsDetailedGalleryOpen(false)} />}

            {isZoomed && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsZoomed(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    {item.images && item.images.length > 1 && (
                        <button 
                            onClick={handlePrevClick} 
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="w-8 h-8" />
                        </button>
                    )}

                    <img 
                        key={activeImageIndex}
                        src={item.images?.[activeImageIndex]} 
                        alt={item.title[lang]} 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg animate-zoom-slide-up"
                        onClick={e => e.stopPropagation()}
                    />
                    
                    {item.images && item.images.length > 1 && (
                        <button 
                            onClick={handleNextClick} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="w-8 h-8" />
                        </button>
                    )}
                </div>
            )}

            {isFullScreenMobile && (
                 <div 
                    className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-0 animate-fade-in"
                    onClick={() => setIsFullScreenMobile(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsFullScreenMobile(false); }}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    {item.images && item.images.length > 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-[110]">
                            {activeImageIndex + 1} / {item.images.length}
                        </div>
                    )}

                    <img 
                        key={activeImageIndex}
                        src={item.images?.[activeImageIndex]} 
                        alt={item.title[lang]} 
                        className="max-w-[100vw] max-h-[100vh] object-contain animate-zoom-slide-up"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
            {showCopied && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg transition-opacity duration-300 animate-fade-in">
                    <CheckIcon className="w-5 h-5" />
                    <span>{t('modal.copied')}</span>
                </div>
            )}
        </>,
        document.body
    );
};

export default Modal;
