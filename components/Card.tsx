import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Listing, Prikazna, Ponuda, MultiLangString, Restaurant, Accommodation, Restaurant as ShoppingItem } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import HeartIcon from './icons/HeartIcon';
import GoogleIcon from './icons/GoogleIcon';
import TagIcon from './icons/TagIcon';
import ClockIcon from './icons/ClockIcon';
import TicketIcon from './icons/TicketIcon';
import CalendarIcon from './icons/CalendarIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import UserIcon from './icons/UserIcon';
import PlateIcon from './icons/PlateIcon';
import CasinoChipIcon from './icons/CasinoChipIcon';
import SlotMachineIcon from './icons/SlotMachineIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';


interface CardProps {
    item: Listing;
    imageClassName?: string;
    contentClassName?: string;
    shadowClassName?: string;
    className?: string;
    variant?: string;
}

const StarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const WifiIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.562a4.5 4.5 0 017.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.875 12.125a7.5 7.5 0 0114.25 0M1.5 8.625a12 12 0 0121 0" />
    </svg>
);

const ParkingIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a2 2 0 00-2 2v16l-3-3m6 0l-3 3m0-16a2 2 0 012 2v16" />
        <path d="M9 21h6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 2a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1H9z" />
    </svg>
);

const isRestaurant = (listing: Listing): listing is Restaurant => {
    return 'details' in listing && 'cuisine_type' in (listing as any).details;
};

const isPonuda = (listing: Listing): listing is Ponuda => 'businessName' in listing;

const Card: React.FC<CardProps> = ({ 
    item, 
    imageClassName,
    contentClassName,
    shadowClassName = "shadow-md",
    className = "",
    variant
}) => {
    const { t, language } = useTranslation();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const lang = language as keyof MultiLangString;

    if (!item) {
        return null;
    }

    const thisItemIsFavorite = isFavorite(item.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (thisItemIsFavorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item.id);
        }
    };
    
    // Definitions moved to top scope for use in both variants
    const shoppingCategories = [
        'trgovski-centri', 'butici', 'obuvki', 'za-deca', 'supermarketi', 
        'apteki', 'domasni-proizvodi'
    ];
    const isShopping = 'category' in item && shoppingCategories.includes(item.category);

    const entertainmentCategories = ['kazina', 'klubovi', 'barovi', 'kafe-barovi'];
    const isEntertainment = (listing: Listing): listing is Restaurant => {
        return 'category' in listing && entertainmentCategories.includes(listing.category);
    };
    
    const isPrikazna = (listing: Listing): listing is Prikazna => 'publicationDate' in listing;
    const attractionCategories = ['muzei', 'prirodni-ubavini', 'istoriski-lokaliteti'];
    const isAttraction = 'category' in item && attractionCategories.includes(item.category);

    const getLinkUrl = () => {
        if (isRestaurant(item)) return `/${lang}/restaurants/${item.id}`;
        if (isShopping) return `/${lang}/shopping/${item.id}`;
        if (isEntertainment(item)) return `/${lang}/entertainment/${item.id}`;
        if (isAttraction) return `/${lang}/attractions/${item.id}`;
        if (isWineParadise) return `/${lang}/wine-paradise/${item.id}`;
        return `/${lang}`;
    };


    // Poster variant for homepage mobile sliders
    if (variant === 'poster') {
        
        // Logic to determine highlight text and color for mobile poster
        let highlightText = null;
        let ribbonColor = '';

        if (isRestaurant(item)) {
            highlightText = item.highlight?.[lang];
            ribbonColor = 'bg-green-600';
        } else if (isShopping) {
            highlightText = (item as ShoppingItem).highlight?.[lang];
            ribbonColor = 'bg-blue-600';
        } else if (isEntertainment(item)) {
            highlightText = (item as Restaurant).highlight?.[lang];
            ribbonColor = 'bg-rose-600';
        } else if (isAttraction) {
            highlightText = (item as Restaurant).highlight?.[lang];
            ribbonColor = 'bg-teal-600';
        }

        return (
            <Link
                to={getLinkUrl()}
                className="w-full flex-shrink-0 h-full rounded-lg shadow-lg overflow-hidden cursor-pointer group transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shine-effect flex flex-col"
            >
                <div className="relative aspect-[10/16] overflow-hidden bg-gray-200 dark:bg-gray-700">
                     {item.images && item.images.length > 0 ? (
                        <img src={item.images?.[0]} alt={item.title?.[lang] || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <PlateIcon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
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

                    {/* Unified Highlight Ribbon Logic for Mobile */}
                    {highlightText ? (
                         <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-10">
                            <div className={`absolute transform -rotate-45 ${ribbonColor} text-white text-[10px] font-bold text-center uppercase py-0.5 shadow-md w-[120px] left-[-25px] top-[15px]`}>
                                {highlightText}
                            </div>
                        </div>
                    ) : isPonuda(item) ? (
                         <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                            {t(`filters.${item.category}`)}
                        </div>
                    ) : isAttraction ? (
                         <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                            {t(`categories.${item.category}`)}
                        </div>
                    ) : isShopping ? (
                         <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                            {t(`categories.${item.category}`)}
                        </div>
                    ) : null}

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h4 className="text-base font-bold leading-tight drop-shadow-md line-clamp-2 mb-1 group-hover:text-brand-accent transition-colors">
                            {item.title[lang]}
                        </h4>
                        
                        {isRestaurant(item) ? (
                            <div className="flex justify-between items-center mt-2">
                                {item.rating && item.rating.reviews > 0 ? (
                                    <div className="flex items-center gap-1 text-xs">
                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold">{item.rating.score.toFixed(1)}</span>
                                        <span className="opacity-80">({item.rating.reviews})</span>
                                    </div>
                                ) : <div />}
                                {item.details.cuisine_type?.[lang] && (
                                    <span className="text-xs font-semibold bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[50%]">
                                        {item.details.cuisine_type[lang].split(',')[0]}
                                    </span>
                                )}
                            </div>
                        ) : isPonuda(item) ? (
                             <div className="mt-2 text-xs space-y-1">
                                <p className="font-semibold truncate">{item.businessName[lang]}</p>
                                {item.details['valid_until']?.[lang] && (
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <CalendarIcon className="w-3 h-3"/>
                                        <span>{t('card.validUntil')} {item.details['valid_until'][lang]}</span>
                                    </div>
                                )}
                            </div>
                        ) : isAttraction ? (
                            <div className="flex justify-between items-center mt-2 text-xs space-x-2">
                                {'details' in item && (item.details as any)['working_hours']?.[lang] ? (
                                    <div className="flex items-center gap-1.5 opacity-80 min-w-0">
                                        <ClockIcon className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{(item.details as any)['working_hours'][lang]}</span>
                                    </div>
                                ) : <div />}
                                {'details' in item && (item.details as any)['ticket']?.[lang] ? (
                                    <div className="flex items-center gap-1.5 opacity-90 font-semibold min-w-0">
                                        <TicketIcon className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{(item.details as any)['ticket'][lang]}</span>
                                    </div>
                                ) : <div />}
                            </div>
                        ) : isShopping ? (
                            <div className="flex justify-between items-center mt-2 text-xs space-x-2">
                                {'details' in item && (item.details as any)['working_hours']?.[lang] ? (
                                    <div className="flex items-center gap-1.5 opacity-80 min-w-0">
                                        <ClockIcon className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{(item.details as any)['working_hours'][lang]}</span>
                                    </div>
                                ) : <div />}
                                {(() => {
                                    const cardPaymentValue = ('details' in item && (item.details as any)['card_payment']?.[lang] || '').toLowerCase();
                                    const canPayWithCard = cardPaymentValue === 'да' || cardPaymentValue === 'yes';
                                    return canPayWithCard ? (
                                        <div className="flex items-center gap-1.5 opacity-90 font-semibold min-w-0" title={t('details.card_payment')}>
                                            <CreditCardIcon className="w-4 h-4 flex-shrink-0" />
                                        </div>
                                    ) : <div />;
                                })()}
                            </div>
                        ) : isEntertainment(item) ? (
                             (() => {
                                const workingHours = 'details' in item && (item.details as any)['working_hours']?.[lang];
                                const firstFeature = item.features?.[0];
                                return (
                                    <div className="flex justify-between items-center mt-2 text-xs space-x-2">
                                        {workingHours ? (
                                            <div className="flex items-center gap-1.5 opacity-80 min-w-0">
                                                <ClockIcon className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{workingHours}</span>
                                            </div>
                                        ) : <div />}
                                        {firstFeature ? (
                                            <span className="text-xs font-semibold bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[50%]">
                                                {t(`features.${firstFeature}`)}
                                            </span>
                                        ) : <div />}
                                    </div>
                                )
                            })()
                        ) : isPrikazna(item) ? (
                            <p className="text-xs text-gray-300 mt-1">
                                {new Date((item as Prikazna).publicationDate).toLocaleDateString(language)}
                            </p>
                        ) : (
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className="font-semibold text-brand-accent">{t(`categories.${item.category}`)}</span>
                                {item.rating && item.rating.reviews > 0 && (
                                    <div className="flex items-center gap-1">
                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold">{item.rating.score.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    }


    // Specific layouts for unique card types on their own pages
    if (isPonuda(item)) {
        const businessName = item.businessName[lang];
        const title = item.title[lang];
        const details = item.details;
        const ctaText = t('card.seeOffer');

        return (
            <Link
                to={`/${lang}/special-offers/${item.id}`}
                className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2),_0_4px_6px_-4px_rgba(0,0,0,0.2)] overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full shine-effect"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={title || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                         <img src="https://picsum.photos/seed/placeholder/800/600" alt={t('card.placeholderAlt', { title: title }) || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors"
                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                    >
                        <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                    </button>
                </div>
                <div className="ticket-body flex-grow flex flex-col justify-between p-6 bg-white dark:bg-slate-900">
                    <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-700 -mx-6 mb-6"></div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{businessName}</p>
                        <h3 className="text-xl font-serif font-extrabold text-brand-text dark:text-gray-100 mb-2 leading-tight group-hover:text-brand-accent transition-colors duration-300">{title}</h3>
                    </div>
                    <div className="mt-auto">
                        {details && details['valid_until'] && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500"/>
                                <span className="font-semibold">{t('card.validUntil')}:</span>&nbsp;{details['valid_until'][lang]}
                            </p>
                        )}
                        <span className="block w-full text-center bg-brand-accent/10 text-brand-accent dark:bg-brand-accent dark:text-white font-bold py-3 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                            {ctaText}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }
    
    if (isShopping) {
         const title = item.title[lang];
         const shortDescription = (item.shortDescription || item.description)[lang];
         const ctaText = t('card.seeMore');
         const highlightText = (item as ShoppingItem).highlight?.[lang];
         const cardBgClass = 'bg-white';

        return (
            <Link
                to={`/${lang}/shopping/${item.id}`}
                className={`${cardBgClass} dark:bg-slate-900 dark:border dark:border-slate-800 dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2),_0_4px_6px_-4px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col sm:flex-row h-full sm:min-h-60 shine-effect`}
            >
                <div className="aspect-square sm:aspect-auto sm:w-2/5 sm:h-auto relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={title || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <img src="https://picsum.photos/seed/placeholder/800/600" alt={t('card.placeholderAlt', { title: title }) || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {highlightText && (
                        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
                            <div className="absolute transform -rotate-45 bg-blue-600 text-white text-xs font-bold text-center uppercase py-1 shadow-md w-[170px] left-[-35px] top-[32px]">
                                {highlightText}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors"
                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                    >
                        <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                    </button>
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-between sm:border-l-2 sm:border-dashed sm:border-gray-200 dark:sm:border-slate-700">
                    <div>
                        {!highlightText && (
                          <p className="text-sm font-bold text-brand-accent mb-1">{t(`categories.${item.category}`)}</p>
                        )}
                        <h3 className="text-lg md:text-xl font-serif font-bold text-brand-text dark:text-gray-100 mb-3 leading-tight">{title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{shortDescription}</p>
                    </div>
                    <div className="mt-auto">
                        {'details' in item && (item.details as any)['working_hours']?.[lang] && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                                <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500"/>
                                <span className="font-semibold">{t('details.working_hours')}:</span>&nbsp;{(item.details as any)['working_hours'][lang]}
                            </p>
                        )}
                        <span className="block w-full text-center bg-brand-accent/10 text-brand-accent dark:bg-brand-accent dark:text-white font-bold py-2 px-4 rounded-lg group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                            {ctaText}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // Default Card: Full-bleed image style for main listing pages
    const wineParadiseCategories = ['so-degustacija', 'prodazba-na-vino'];
    const isWineParadise = 'category' in item && wineParadiseCategories.includes(item.category);
    
    // Logic for desktop/default cards
    const highlightText = (isRestaurant(item) || isAttraction || isEntertainment(item)) && (item as Restaurant).highlight ? (item as Restaurant).highlight?.[lang] : null;
    const ribbonColor = isRestaurant(item) ? 'bg-green-600' : isAttraction ? 'bg-teal-600' : isEntertainment(item) ? 'bg-rose-600' : '';


    return (
        <Link
            to={getLinkUrl()}
            className={`relative w-full h-96 rounded-lg ${shadowClassName} overflow-hidden cursor-pointer group transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shine-effect ${className}`}
        >
            {item.images && item.images.length > 0 ? (
                <img src={item.images?.[0]} alt={item.title?.[lang] || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <PlateIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <button
                onClick={handleFavoriteClick}
                className="absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors"
                aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
            >
                <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
            </button>
            
            {highlightText && ribbonColor ? (
                 <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
                    <div className={`absolute transform -rotate-45 ${ribbonColor} text-white text-xs font-bold text-center uppercase py-1 shadow-md w-[170px] left-[-35px] top-[32px]`}>
                        {highlightText}
                    </div>
                </div>
            ) : ('category' in item && !isPrikazna(item) && (
                <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm z-10">
                    {t(`categories.${item.category}`)}
                </div>
            ))}
            
            <div className="relative p-5 flex flex-col justify-end h-full text-white">
                <h3 className="text-xl font-serif font-bold mb-2 drop-shadow-md">{item.title[lang]}</h3>
                <p className="text-white/90 text-sm mb-3 line-clamp-2 drop-shadow-sm">{(item.shortDescription || item.description)[lang]}</p>
                
                <div className="pt-3 border-t border-white/20">
                    {isPrikazna(item) ? (
                        <div className="flex items-center space-x-3 text-sm">
                            {item.authorAvatar ? (
                                <img src={item.authorAvatar} alt={item.author} className="w-9 h-9 rounded-full object-cover border-2 border-white/50"/>
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gray-600/50 flex items-center justify-center">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                            )}
                            <div className="leading-tight">
                                <p className="font-semibold">{item.author}</p>
                                <p className="text-xs opacity-80">{new Date(item.publicationDate).toLocaleDateString(language)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-200">
                                {!isAttraction && !isWineParadise && item.rating && item.rating.reviews > 0 && (
                                    <div className="flex items-center space-x-1">
                                        <StarIcon className="w-5 h-5 text-yellow-400" />
                                        <span className="font-bold text-sm">{item.rating.score.toFixed(1)}</span>
                                        <span className="text-xs opacity-80">({item.rating.reviews})</span>
                                    </div>
                                )}
                                {'amenities' in item && (item as Accommodation).amenities.includes('wifi') && (
                                    <div className="flex items-center space-x-1.5" title="WiFi">
                                        <WifiIcon className="w-4 h-4" />
                                    </div>
                                )}
                                {'amenities' in item && ((item as Accommodation).amenities.includes('parking') || (item as Accommodation).amenities.includes('private_parking')) && (
                                    <div className="flex items-center space-x-1.5" title={(item as Accommodation).amenities.includes('private_parking') ? t('amenities.private_parking') : t('amenities.parking')}>
                                        <ParkingIcon className="w-4 h-4" />
                                    </div>
                                )}
                                {isAttraction && 'details' in item && (
                                    <div className="flex items-center space-x-4 text-sm">
                                        {item.details['working_hours']?.[lang] && (
                                            <div className="flex items-center space-x-2" title={t('details.working_hours')}>
                                                <ClockIcon className="w-4 h-4" />
                                                <span>{item.details['working_hours'][lang]}</span>
                                            </div>
                                        )}
                                        {item.details['ticket']?.[lang] && (
                                             <div className="flex items-center space-x-2" title={t('details.ticket')}>
                                                <TicketIcon className="w-4 h-4" />
                                                <span>{item.details['ticket'][lang]}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {isEntertainment(item) && item.features && item.features.length > 0 && (
                                     <div className="flex items-center space-x-3 h-5">
                                        {item.features.includes('24-7') && (
                                            <div className="flex items-center space-x-1.5" title={t('features.24-7')}><ClockIcon className="w-4 h-4" /></div>
                                        )}
                                        {item.features.includes('slot-masini') && (
                                            <div className="flex items-center space-x-1.5" title={t('features.slot-masini')}><SlotMachineIcon className="w-4 h-4" /></div>
                                        )}
                                        {item.features.includes('igri-vo-zivo') && (
                                            <div className="flex items-center space-x-1.5" title={t('features.igri-vo-zivo')}><CasinoChipIcon className="w-4 h-4" /></div>
                                        )}
                                        {item.features.includes('muzika-vo-zivo') && (
                                            <div className="flex items-center space-x-1.5" title={t('features.muzika-vo-zivo')}><MusicNoteIcon className="w-4 h-4" /></div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {(item as Restaurant).details?.cuisine_type?.[lang] && (
                                <p className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">{(item as Restaurant).details.cuisine_type[lang]}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default Card;