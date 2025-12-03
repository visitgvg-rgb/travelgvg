
import React from 'react';
import { useTranslation } from '../i18n';
import type { Restaurant as WineryItem, MultiLangString } from '../types';
import WineGlassIcon from './icons/WineGlassIcon';
import PlateIcon from './icons/PlateIcon';
import MapTourIcon from './icons/MapTourIcon';
import StoreIcon from './icons/StoreIcon';
import { useFavorites } from '../context/FavoritesContext';
import HeartIcon from './icons/HeartIcon';

interface WineryCardProps {
    item: WineryItem;
    onDetailsClick: () => void;
    useFlipEffect?: boolean;
}

const FeatureIcons: React.FC<{ item: WineryItem, iconClass?: string, textClass?: string, wrapperClass?: string, limit?: number }> = ({ item, iconClass = "w-5 h-5", textClass = "text-xs font-semibold", wrapperClass = "flex items-center justify-center flex-wrap gap-x-4 gap-y-2", limit }) => {
    const { t } = useTranslation();
    
    // Hide features for free packages
    if (item.package === 'free' || !item.features || item.features.length === 0) return null;

    const allFeatures = [
        { key: 'degustacija', icon: <WineGlassIcon className={iconClass} />, label: t('features.degustacija') },
        { key: 'hrana', icon: <PlateIcon className={iconClass} />, label: t('features.hrana') },
        { key: 'tura', icon: <MapTourIcon className={iconClass} />, label: t('features.tura') },
        { key: 'prodazba', icon: <StoreIcon className={iconClass} />, label: t('features.prodazba') },
    ];
    
    const availableFeatures = allFeatures.filter(f => item.features.includes(f.key));
    const featuresToDisplay = limit ? availableFeatures.slice(0, limit) : availableFeatures;

    return (
        <div className={wrapperClass}>
            {featuresToDisplay.map(feature => (
                 <div key={feature.key} className="flex items-center space-x-1.5" title={feature.label}>
                    {feature.icon}
                    <span className={textClass}>{feature.label}</span>
                </div>
            ))}
        </div>
    );
};

const WineryCard: React.FC<WineryCardProps> = ({ item, onDetailsClick, useFlipEffect = true }) => {
    const { t, language } = useTranslation();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const lang = language as keyof MultiLangString;
    const [isFlipped, setIsFlipped] = React.useState(false);
    
    const highlightText = item.highlight?.[lang];
    const thisItemIsFavorite = isFavorite(item.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (thisItemIsFavorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item.id);
        }
    };

    const handleFlip = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.details-button') || (e.target as HTMLElement).closest('.fav-button')) {
            return;
        }
        setIsFlipped(!isFlipped);
    };
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const PosterStyleCard = () => (
         <div onClick={onDetailsClick} className="relative rounded-lg shadow-lg overflow-hidden cursor-pointer group h-96 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shine-effect">
            <img 
                src={item.images[0]} 
                alt={item.title?.[lang] || 'TravelGVG image'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" 
                loading="lazy"
                decoding="async"
            />
            
            <button 
                onClick={handleFavoriteClick} 
                className="fav-button absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors" 
                aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
            >
                <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
            </button>

            {highlightText && (
                <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
                    <div className="absolute transform -rotate-45 bg-red-800 text-white text-xs font-bold text-center uppercase py-1 shadow-md w-[170px] left-[-35px] top-[32px]">
                        {highlightText}
                    </div>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            
            <div className="relative p-5 flex flex-col h-full text-white">
                <div className="flex-grow"></div>
                <h3 className="text-2xl font-serif font-bold mb-2 drop-shadow-md">{item.title[lang]}</h3>
                <p className="text-white/80 text-sm line-clamp-3 mb-4 drop-shadow-sm">{item.description[lang]}</p>
                {item.package !== 'free' && (
                    <div className="pt-4 border-t border-white/20">
                        <FeatureIcons item={item} limit={2} />
                    </div>
                )}
            </div>
        </div>
    );

    const FlipCard = () => (
        <div className={`flip-card h-96 ${isFlipped ? 'is-flipped' : ''}`} onClick={handleFlip}>
            <div className="flip-card-inner">
                {/* Front of the card */}
                <div className="flip-card-front bg-gray-800 text-white">
                    <img src={item.images[0]} alt={item.title?.[lang] || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover"/>
                    
                    <button 
                        onClick={handleFavoriteClick} 
                        className="fav-button absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:text-white/80 transition-colors" 
                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                    >
                        <HeartIcon className={`w-5 h-5 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                    </button>

                    {highlightText && (
                        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
                            <div className="absolute transform -rotate-45 bg-red-800 text-white text-xs font-bold text-center uppercase py-1 shadow-md w-[170px] left-[-35px] top-[32px]">
                                {highlightText}
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="relative p-5 flex flex-col justify-end h-full">
                         <h3 className="text-2xl font-serif font-bold drop-shadow-md">{item.title[lang]}</h3>
                    </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90 text-sm font-semibold animate-pulse">Допри за детали</div>
                </div>
                {/* Back of the card */}
                <div className="flip-card-back bg-slate-800 text-white p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-serif font-bold mb-2">{item.title[lang]}</h4>
                        <p className="text-sm text-slate-300 line-clamp-4 mb-4">{item.description[lang]}</p>
                    </div>
                    <div className="space-y-4">
                       <FeatureIcons item={item} iconClass="w-5 h-5 text-brand-accent" textClass="text-sm text-slate-200" />
                       <button
                           onClick={(e) => { e.stopPropagation(); onDetailsClick(); }}
                           className="details-button w-full mt-4 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                       >
                           {t('card.seeMore')}
                       </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const MobileView = () => {
        if (useFlipEffect) {
            return <FlipCard />;
        }
        
        // Custom poster implementation for homepage wine section
        return (
            <div 
                onClick={onDetailsClick}
                className="w-48 h-full rounded-lg shadow-lg overflow-hidden cursor-pointer group transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shine-effect"
            >
                <div className="relative aspect-[10/16] overflow-hidden bg-gray-700">
                    <img src={item.images[0]} alt={item.title?.[lang] || 'TravelGVG image'} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    <button 
                        onClick={handleFavoriteClick} 
                        className="fav-button absolute top-2 right-2 z-20 bg-black/30 p-1.5 rounded-full text-white hover:text-white/80 transition-colors" 
                        aria-label={thisItemIsFavorite ? t('favorites.remove') : t('favorites.add')}
                    >
                        <HeartIcon className={`w-4 h-4 ${thisItemIsFavorite ? 'text-brand-accent' : ''}`} filled={thisItemIsFavorite} />
                    </button>

                    {highlightText ? (
                        <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-10">
                            <div className="absolute transform -rotate-45 bg-red-800 text-white text-[10px] font-bold text-center uppercase py-0.5 shadow-md w-[120px] left-[-25px] top-[15px]">
                                {highlightText}
                            </div>
                        </div>
                    ) : (
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                            {t(`categories.${item.category}`)}
                        </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h4 className="text-base font-bold leading-tight drop-shadow-md line-clamp-2 mb-2 group-hover:text-brand-accent transition-colors">
                            {item.title[lang]}
                        </h4>
                        {item.package !== 'free' && (
                            <FeatureIcons 
                                item={item} 
                                iconClass="w-4 h-4 text-brand-accent" 
                                textClass="text-xs"
                                wrapperClass="flex items-center justify-start gap-x-3 opacity-90"
                                limit={2}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
    const DesktopView = () => <PosterStyleCard />;

    return isMobile ? <MobileView /> : <DesktopView />;
};

export default WineryCard;
