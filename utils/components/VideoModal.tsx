
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Short, MultiLangString } from '../types';

interface VideoModalProps {
    short: Short;
    onClose: () => void;
}

const convertYoutubeShortsToEmbed = (url: string): string => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
    
    // Fallback if URL is already an embed URL
    if (url.includes('/embed/')) {
        return `${url}?autoplay=1&rel=0`;
    }

    console.warn("Could not extract YouTube video ID from URL:", url);
    return '';
};

const VideoModal: React.FC<VideoModalProps> = ({ short, onClose }) => {
    const { language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;
    const navigate = useNavigate();
    const embedUrl = convertYoutubeShortsToEmbed(short.videoUrl);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.body.classList.add('modal-open');
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.body.classList.remove('modal-open');
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handleCtaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
        // Use navigate for internal links, open external links in a new tab
        if (short.ctaLink.startsWith('/')) {
            navigate(getLocalizedPath(short.ctaLink));
        } else {
            window.open(short.ctaLink, '_blank', 'noopener,noreferrer');
        }
    };

    if (!embedUrl) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="relative w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <div className="aspect-[9/16] bg-black rounded-xl shadow-2xl overflow-hidden">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                        <div className="pointer-events-auto">
                            <h3 className="text-white font-bold text-lg drop-shadow-md mb-4">{short.title[lang]}</h3>
                            <button
                                onClick={handleCtaClick}
                                className="w-full bg-white/20 backdrop-blur-lg text-white font-semibold py-3 px-4 rounded transition-all duration-300 hover:bg-brand-accent"
                            >
                                {short.ctaText[lang]}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] transition-colors"
                aria-label="Close"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default VideoModal;
