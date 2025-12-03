
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Accommodation, MultiLangString } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import HeartIcon from './icons/HeartIcon';
import NoSmokingIcon from './icons/NoSmokingIcon';
import BalconyIcon from './icons/BalconyIcon';
import PawIcon from './icons/PawIcon';
import BedIcon from './icons/BedIcon';

const StarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// Amenity Icons
const WifiIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 19.5a3.75 3.75 0 117.5 0v-6.75h-7.5v6.75zM15.75 12.75v-6.75a3.75 3.75 0 10-7.5 0v6.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.562a4.5 4.5 0 017.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008zM4.875 12.125a7.5 7.5 0 0114.25 0M1.5 8.625a12 12 0 0121 0" /></svg>;

// Just the letter P
const SimpleParkingIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5h4a3 3 0 0 1 0 6H8V5zm0 6v7" /></svg>;

// P inside a circle
const PrivateParkingIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 8h3a2 2 0 0 1 0 4H9V8zm0 4v4" /></svg>;

const ACIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const TVIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" /></svg>;
const FamilyIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
const BathroomIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18" /></svg>;
const PoolIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V15H2.25v2.25A2.25 2.25 0 0 0 4.5 19.5Zm0-4.5h15m-15-4.5h15m-15-4.5h15M6.75 21v-3.75a3 3 0 0 1 3-3h4.5a3 3 0 0 1 3 3V21" /></svg>;
const SpaIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" /></svg>;
const KitchenIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v16.5M15 3.75v16.5M13.5 3h-3m4.5 0h-6m7.5 18h-9a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5Z" /></svg>;
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;


const AmenityIcon: React.FC<{ amenityKey: string; className?: string }> = ({ amenityKey, className = "w-5 h-5" }) => {
    switch(amenityKey) {
        case 'private_parking':
            return <PrivateParkingIcon className={className} />;
        case 'parking':
        case 'free_parking':
            return <SimpleParkingIcon className={className} />;
        case 'wifi':
            return <WifiIcon className={className} />;
        case 'air_conditioning':
            return <ACIcon className={className} />;
        case 'tv_flat_screen':
            return <TVIcon className={className} />;
        case 'family_rooms':
            return <FamilyIcon className={className} />;
        case 'private_bathroom':
            return <BathroomIcon className={className} />;
        case 'pool':
            return <PoolIcon className={className} />;
        case 'spa_center':
            return <SpaIcon className={className} />;
        case 'pets_allowed':
            return <PawIcon className={className} />;
        case 'kitchen':
            return <KitchenIcon className={className} />;
        case 'non_smoking_rooms':
            return <NoSmokingIcon className={className} />;
        case 'balcony_terrace':
            return <BalconyIcon className={className} />;
        default:
            return <CheckIcon className={className} />;
    }
};

const AccommodationCard: React.FC<{ item: Accommodation; variant?: 'default' | 'poster' }> = ({ item, variant = 'default' }) => {
    const { t, language } = useTranslation();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const lang = language as keyof MultiLangString;
    
    const thisItemIsFavorite = isFavorite(item.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (thisItemIsFavorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item.id);
        }
    };
    
    if (variant === 'poster') {
        return (
            <Link
                to={`/${lang}/accommodation/${item.id}`}
                className="w-48 h-full rounded-lg shadow-lg overflow-hidden cursor-pointer group transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shine-effect flex flex-col"
            >
                <div className="relative aspect-[10/16] overflow-hidden bg-gray-200 dark:bg-gray-700">
                     {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.title?.[lang] || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <BedIcon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-2 right-2 z-20 bg-black/30 p-1.5 rounded-full text-white hover:text-white/80 transition-colors"
                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                    >
                        <HeartIcon className={`w-4 h-4 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                    </button>

                    {item.discount ? (
                        <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-10">
                            <div className="absolute transform -rotate-45 bg-brand-accent text-white text-[10px] font-bold text-center uppercase py-0.5 shadow-md w-[120px] left-[-25px] top-[15px]">
                                {item.discount}
                            </div>
                        </div>
                    ) : (
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                            {t(`categories.${item.category}`)}
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h4 className="text-base font-bold leading-tight drop-shadow-md line-clamp-2 mb-1 group-hover:text-brand-accent transition-colors">
                            {item.title[lang]}
                        </h4>
                        <div className="flex justify-between items-center mt-2">
                            {item.rating && item.rating.reviews > 0 ? (
                                <div className="flex items-center gap-1 text-xs">
                                    <StarIcon className="w-4 h-4 text-yellow-400" />
                                    <span className="font-bold">{item.rating.score.toFixed(1)}</span>
                                    <span className="opacity-80">({item.rating.reviews})</span>
                                </div>
                            ) : (
                                <div /> /* Placeholder for alignment */
                            )}

                            {item.priceFrom && item.currency && item.priceFrom[lang] && (
                                <p className="font-bold text-base text-brand-yellow drop-shadow-md">
                                    {item.currency[lang]}
                                    {new Intl.NumberFormat().format(item.priceFrom[lang])}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }


    return (
        <Link
            to={`/${lang}/accommodation/${item.id}`}
            className="relative h-96 rounded-lg shadow-lg overflow-hidden group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shine-effect"
        >
            <img
                src={item.images[0]}
                alt={item.title?.[lang] || 'TravelGVG image'}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <button onClick={handleFavoriteClick} className="absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors" aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}>
                <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
            </button>
            
            {item.discount ? (
                <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
                    <div className="absolute transform -rotate-45 bg-brand-accent text-white text-xs font-bold text-center uppercase py-1 shadow-md w-[170px] left-[-35px] top-[32px]">
                        {item.discount}
                    </div>
                </div>
            ) : (
                <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm z-10">
                    {t(`categories.${item.category}`)}
                </div>
            )}
            
            <div className="relative p-5 flex flex-col justify-end h-full text-white">
                <h3 className="text-xl font-serif font-bold mb-1 drop-shadow-md">{item.title[lang]}</h3>
                <div className="h-[2.5rem] mb-3 flex items-end">
                    {item.priceFrom && item.currency && item.priceFrom[lang] && (
                        <p className="text-sm font-semibold text-white/90 drop-shadow-sm">
                            {t('accommodationCard.priceFrom')}&nbsp;
                            <span className="font-bold text-lg text-brand-yellow drop-shadow-md">
                                {new Intl.NumberFormat().format(item.priceFrom[lang])} {item.currency[lang]}
                            </span>
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    {item.rating && item.rating.reviews > 0 ? (
                        <div className="flex items-center space-x-1 text-gray-200">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-sm">{item.rating.score.toFixed(1)}</span>
                            <span className="text-xs opacity-80">({item.rating.reviews})</span>
                        </div>
                    ) : (
                        <div></div> 
                    )}
                    <div className="flex items-center space-x-3 text-gray-200">
                       {item.amenities.slice(0, 3).map(amenityKey => (
                            <div key={amenityKey} title={t(`amenities.${amenityKey}`)}>
                                <AmenityIcon amenityKey={amenityKey} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AccommodationCard;
