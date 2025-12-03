
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Short, MultiLangString } from '../types';
import PlayIcon from './icons/PlayIcon';

// Helper functions to handle YouTube URLs
const getYoutubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const getYoutubeThumbnailUrl = (videoId: string): string => {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

interface VideoShortCardProps {
    short: Short;
    onPlayClick: () => void;
}

const VideoShortCard: React.FC<VideoShortCardProps> = ({ short, onPlayClick }) => {
    const { language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;
    const navigate = useNavigate();

    const videoId = getYoutubeVideoId(short.videoUrl);
    const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(videoId) : 'https://picsum.photos/seed/placeholder/360/640';

    const handleCtaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (short.ctaLink.startsWith('/')) {
            navigate(getLocalizedPath(short.ctaLink));
        } else {
            window.open(short.ctaLink, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div 
            className="flex-shrink-0 w-52 snap-center cursor-pointer group"
            onClick={onPlayClick}
        >
            <div className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                <img
                    src={thumbnailUrl}
                    alt={short.title[lang]}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50"></div>
                
                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:bg-brand-accent group-hover:scale-110">
                        <PlayIcon className="w-8 h-8 ml-1" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative p-4 flex flex-col h-full text-white">
                    {/* Title */}
                    <h3 className="font-bold text-base leading-tight drop-shadow-md">
                        {short.title[lang]}
                    </h3>
                    
                    {/* CTA Button at the bottom */}
                    <div className="mt-auto">
                         <button
                            onClick={handleCtaClick}
                            className="w-full bg-white/20 backdrop-blur-lg text-white font-semibold text-sm py-2 px-4 rounded transition-all duration-300 hover:bg-brand-accent hover:text-white"
                        >
                            {short.ctaText[lang]}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoShortCard;
