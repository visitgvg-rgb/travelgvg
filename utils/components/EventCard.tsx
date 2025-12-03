
import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import type { Event, MultiLangString } from '../types';
import ClockIcon from './icons/ClockIcon';
import MapPinIcon from './icons/MapPinIcon';
import ShareIcon from './icons/ShareIcon';
import CheckIcon from './icons/CheckIcon';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const [showCopied, setShowCopied] = useState(false);

    const eventDate = new Date(event.date);
    const day = eventDate.toLocaleDateString(language, { day: '2-digit' });
    const month = eventDate.toLocaleDateString(language, { month: 'short' });

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Removed #/ from URL construction for BrowserRouter compatibility
        const shareUrl = `${window.location.origin}/events#${event.id}`;

        const shareData = {
            title: event.title[lang],
            text: event.description[lang],
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

    return (
        <div id={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shine-effect">
            <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                <img src={event.image} alt={event.title[lang]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="md:w-2/3 p-5 flex flex-col">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent dark:text-orange-300 p-3 rounded-lg">
                        <p className="text-2xl font-bold">{day}</p>
                        <p className="text-sm font-semibold uppercase">{month.replace('.', '')}</p>
                    </div>
                    <div className="flex-grow">
                        <span className="text-xs font-bold text-brand-accent uppercase">{t(`filters.${event.category}`)}</span>
                        <h3 className="text-xl font-serif font-bold text-brand-text dark:text-gray-100 mb-2 mt-1 group-hover:text-brand-accent transition-colors">{event.title[lang]}</h3>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm my-4 line-clamp-2 flex-grow">{event.description[lang]}</p>
                <div className="mt-auto border-t dark:border-gray-700 pt-4 flex items-end justify-between">
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            {event.locationUrl ? (
                                <a
                                    href={event.locationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-brand-accent hover:underline transition-colors duration-200"
                                    aria-label={`Open location for ${event.title[lang]} in maps`}
                                >
                                    <span>{event.location[lang]}</span>
                                </a>
                            ) : (
                                <span>{event.location[lang]}</span>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className="text-gray-500 dark:text-gray-400 hover:text-brand-accent transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label={t('social.share')}
                        >
                            <ShareIcon className="w-5 h-5" />
                        </button>
                        {showCopied && (
                            <div className="absolute bottom-full right-0 mb-2 flex items-center gap-1 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg animate-fade-in-fast">
                                <CheckIcon className="w-4 h-4" />
                                <span>{t('modal.copied')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
