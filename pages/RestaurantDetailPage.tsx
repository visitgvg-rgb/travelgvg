
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Restaurant, MultiLangString } from '../types';
import { useTranslation } from '../i18n';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import PhoneIcon from '../components/icons/PhoneIcon';
import MapPinIcon from '../components/icons/MapPinIcon';
import FacebookIcon from '../components/icons/FacebookIcon';
import InstagramIcon from '../components/icons/InstagramIcon';
import ShareIcon from '../components/icons/ShareIcon';
import { useFavorites } from '../context/FavoritesContext';
import HeartIcon from '../components/icons/HeartIcon';
import ClockIcon from '../components/icons/ClockIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import UtensilsCrossedIcon from '../components/icons/UtensilsCrossedIcon';
import InteriorIcon from '../components/icons/InteriorIcon';
import CheckIcon from '../components/icons/CheckIcon';
import TagIcon from '../components/icons/TagIcon';

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

const RestaurantDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();

    const [item, setItem] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/restaurants.json');
                const data: Restaurant[] = await response.json();
                const foundItem = data.find(r => r.id === slug);
                setItem(foundItem || null);
            } catch (error) {
                console.error("Failed to fetch restaurant data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400">{t('restaurantPage.noResults')}</p>
            </div>
        );
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

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!item) return;

        const shareUrl = window.location.href;

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
                alert(t('modal.copied'));
            }).catch(err => {
                console.error('Failed to copy URL:', err);
                alert(t('modal.shareError'));
            });
        }
    };

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

    const itemContact = (item?.contact as any);

    const renderConnectSection = () => {
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
                        className='bg-green-600 text-white hover:bg-green-700 font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm shadow-md flex items-center gap-2'
                    >
                        <WebsiteIcon className="w-4 h-4" />
                        {t('modal.visitWebsite')}
                    </a>
                )}
            </div>
        );
    };

    const isStandardOrPremium = item.package === 'standard' || item.package === 'premium';
    const hasViber = isStandardOrPremium && itemContact?.viber;
    const hasWhatsapp = isStandardOrPremium && itemContact?.whatsapp;

    return (
        <>
            <SEO
                title={item.title[lang]}
                description={item.shortDescription?.[lang] || item.description[lang]}
                image={item.images?.[0]}
            />
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-4 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        {/* Image Gallery */}
                        <div className="mb-4 relative rounded-lg overflow-hidden">
                            <img
                                src={item.images[activeImageIndex]}
                                alt={item.title[lang]}
                                className="w-full h-80 object-cover rounded-lg shadow-md"
                            />
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
                    </div>
                    <div className="lg:col-span-2">
                         <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-brand-text dark:text-gray-100 mb-1 leading-tight">
                            {item.title[lang]}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">{item.description[lang]}</p>
                         {renderConnectSection()}
                          <div className="flex flex-col gap-3 w-full">
                                {item.contact.phone && (
                                    <a href={`tel:${item.contact.phone}`} className='w-full flex items-center justify-center bg-green-600 text-white hover:bg-green-700 font-black py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200'>
                                        <PhoneIcon className="w-5 h-5 mr-2" />
                                        <span className="uppercase tracking-wide text-sm">{t('modal.call')}</span>
                                    </a>
                                )}

                                {(hasViber || hasWhatsapp) && (
                                    <div className="flex flex-row gap-3 w-full">
                                        {hasViber && (
                                            <a href={`viber://chat?number=${itemContact.viber.replace(/\+/g, '')}`} className="flex-1 flex items-center justify-center bg-[#7360f2] text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 hover:bg-[#6655d8]" aria-label="Viber">
                                                <ViberIcon className="w-6 h-6 mr-2" />
                                                <span className="font-bold">Viber</span>
                                            </a>
                                        )}
                                        {hasWhatsapp && (
                                            <a href={`https://wa.me/${itemContact.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center bg-[#25D366] text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 hover:bg-[#20bd5a]" aria-label="WhatsApp">
                                                <WhatsappIcon className="w-6 h-6 mr-2" />
                                                <span className="font-bold">WhatsApp</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                 {item.mapSrc && (
                        <div className="mt-8">
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
        </>
    );
};
export default RestaurantDetailPage;
