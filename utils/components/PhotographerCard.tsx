
import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import type { Photographer, MultiLangString } from '../types';
import ShareIcon from './icons/ShareIcon';
import CheckIcon from './icons/CheckIcon';

interface PhotographerCardProps {
    photographer: Photographer;
    onClick: () => void;
}

const PhotographerCard: React.FC<PhotographerCardProps> = ({ photographer, onClick }) => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const [showCopied, setShowCopied] = useState(false);

    const handleShareClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Removed # from URL construction for BrowserRouter compatibility
        const shareUrl = `${window.location.origin}/photographers/${photographer.id}`;
        
        const shareData = {
            title: photographer.name[lang],
            text: photographer.bio[lang],
            url: shareUrl,
        };
    
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('User cancelled share or share failed:', err);
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
        <div 
            onClick={onClick}
            className="group relative bg-black rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shine-effect"
        >
            <div className="aspect-[3/4]">
                <img 
                    src={photographer.portraitImage} 
                    alt={photographer.name[lang]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <button
                onClick={handleShareClick}
                className="absolute top-3 right-3 z-20 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition-colors"
                aria-label={t('social.share')}
            >
                <ShareIcon className="w-5 h-5" />
            </button>

            {showCopied && (
                <div className="absolute top-3 right-14 z-20 flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white text-xs rounded-full animate-fade-in-fast">
                    <CheckIcon className="w-4 h-4" />
                    <span>{t('modal.copied')}</span>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif font-bold drop-shadow-md">{photographer.name[lang]}</h3>
                <p className="text-sm text-white/80 mt-1 line-clamp-2 drop-shadow">{photographer.bio[lang]}</p>
                <div className="h-0.5 bg-brand-accent mt-4 w-10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
        </div>
    );
};

export default PhotographerCard;
