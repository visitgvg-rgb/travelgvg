import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FilterBar from '../components/FilterBar';
import { useTranslation } from '../i18n';
import type { Short, MultiLangString } from '../types';
import PlayIcon from '../components/icons/PlayIcon';
import VideoCameraIcon from '../components/icons/VideoCameraIcon';
import SEO from '../components/SEO';

// Helper functions to handle YouTube URLs
const getYoutubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const getYoutubeThumbnailUrl = (videoId: string): string => {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

const convertToEmbedUrl = (url: string): string => {
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0`;
    }
    return '';
};

// --- Video Card Component ---
const VideoCard: React.FC<{ short: Short; onClick: () => void }> = ({ short, onClick }) => {
    const { language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const videoId = getYoutubeVideoId(short.videoUrl);
    const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(videoId) : '';

    return (
        <div 
            onClick={onClick}
            className="group relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
        >
            <img
                src={thumbnailUrl}
                alt={short.title[lang]}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <PlayIcon className="w-8 h-8 ml-1" />
                </div>
            </div>
            <div className="relative p-4 flex flex-col justify-end h-full text-white">
                <h3 className="font-bold text-base leading-tight drop-shadow-md line-clamp-2">
                    {short.title[lang]}
                </h3>
            </div>
        </div>
    );
};

// --- Immersive Player Component ---
const ImmersiveVideoPlayer: React.FC<{ videos: Short[]; startIndex: number; onClose: () => void; }> = ({ videos, startIndex, onClose }) => {
    const { language } = useTranslation();
    const lang = language as keyof MultiLangString;
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const swiperRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const touchMoveY = useRef(0);

    const handleNavigate = useCallback((newIndex: number) => {
        if (newIndex >= 0 && newIndex < videos.length) {
            setCurrentIndex(newIndex);
            navigate(`?play=${videos[newIndex].id}`, { replace: true });
        }
    }, [videos, navigate]);

    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') handleNavigate(currentIndex - 1);
            if (e.key === 'ArrowDown') handleNavigate(currentIndex + 1);
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, handleNavigate, onClose]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchMoveY.current = e.targetTouches[0].clientY;
    };
    const handleTouchEnd = () => {
        const delta = touchStartY.current - touchMoveY.current;
        if (Math.abs(delta) > 50) { // Swipe threshold
            if (delta > 0) handleNavigate(currentIndex + 1); // Swipe up
            else handleNavigate(currentIndex - 1); // Swipe down
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY > 50) handleNavigate(currentIndex + 1);
        else if (e.deltaY < -50) handleNavigate(currentIndex - 1);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center animate-fade-in-fast"
            onWheel={handleWheel}
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 z-[60]" aria-label="Close">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div 
                className="w-full h-full max-w-md max-h-[95vh] overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div 
                    ref={swiperRef}
                    className="h-full flex flex-col video-swiper-container"
                    style={{ transform: `translateY(-${currentIndex * 100}%)` }}
                >
                    {videos.map((video, index) => {
                        const embedUrl = convertToEmbedUrl(video.videoUrl);
                        const isActive = index === currentIndex;
                        return (
                            <div key={video.id} className="video-slide relative">
                                {isActive && (
                                     <iframe
                                        src={embedUrl}
                                        title={video.title[lang]}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                )}
                                {/* Removed pointer-events-none to allow full screen swipe interaction */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white pointer-events-auto z-20">
                                    <h3 className="font-bold text-lg mb-4">{video.title[lang]}</h3>
                                    <a
                                        href={`#${video.ctaLink}`}
                                        onClick={(e) => { e.preventDefault(); onClose(); navigate(video.ctaLink); }}
                                        className="w-full bg-white/20 backdrop-blur-lg font-semibold text-sm py-3 px-4 rounded transition-colors hover:bg-brand-accent pointer-events-auto block text-center"
                                    >
                                        {video.ctaText[lang]}
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const VideoMomentsPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [shorts, setShorts] = useState<Short[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    
    const [playerState, setPlayerState] = useState<{isOpen: boolean; startIndex: number}>({isOpen: false, startIndex: 0});

    const filters = [
        { key: 'all', label: t('filters.all') },
        { key: 'hrana', label: t('filters.food') },
        { key: 'smestuvanje', label: t('filters.accommodation') },
        { key: 'atrakcii', label: t('filters.attractions') },
    ];
    
    useEffect(() => {
        const fetchShorts = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/shorts.json');
                const data: Short[] = await response.json();
                setShorts(data);
            } catch (error) {
                console.error("Failed to fetch shorts data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    const filteredShorts = useMemo(() => {
        if (activeFilter === 'all') return shorts;
        return shorts.filter(s => s.category === activeFilter);
    }, [shorts, activeFilter]);

    // Handle opening player from URL param
    useEffect(() => {
        if (shorts.length > 0) {
            const playId = searchParams.get('play');
            if (playId) {
                const index = filteredShorts.findIndex(s => s.id === playId);
                if (index !== -1) {
                    setPlayerState({ isOpen: true, startIndex: index });
                } else {
                     // If video not in current filter, switch filter and open
                    const allIndex = shorts.findIndex(s => s.id === playId);
                    if (allIndex !== -1) {
                        const videoCategory = shorts[allIndex].category;
                        setActiveFilter(videoCategory);
                        // We need to wait for the filter to apply, so we re-trigger effect
                        // This is a bit of a hack, better would be to pass the whole list
                        // but this works for now.
                    }
                }
            }
        }
    }, [shorts, searchParams, filteredShorts]);

    const openPlayer = (index: number) => {
        setPlayerState({ isOpen: true, startIndex: index });
        setSearchParams({ play: filteredShorts[index].id }, { replace: true });
    };

    const closePlayer = () => {
        setPlayerState({ isOpen: false, startIndex: 0 });
        setSearchParams({}, { replace: true });
    };

    const handleFilterChange = (label: string) => {
        const newFilter = filters.find(f => f.label === label);
        if (newFilter) setActiveFilter(newFilter.key);
    };

    const activeFilterLabel = filters.find(f => f.key === activeFilter)?.label || '';

    return (
        <>
            <SEO title={t('seo.gvgPlay')} />
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
                {/* Hero Section styled like Photographers Page */}
                <div className="relative bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 py-20 md:py-32 px-4 sm:px-6 lg:px-8 text-center text-white mb-12 shadow-inner">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/homepage-tsx/videomoment-background.webp" 
                            alt="" 
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                    <div className="relative z-10">
                        <VideoCameraIcon className="w-16 h-16 text-brand-accent mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-serif font-black drop-shadow-lg">{t('videoMomentsPage.title')}</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200 drop-shadow">{t('videoMomentsPage.subtitle')}</p>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm rounded-lg mb-8 dark:border dark:border-gray-700">
                    <FilterBar filters={filters.map(f => f.label)} activeFilter={activeFilterLabel} onFilterChange={handleFilterChange} />
                </div>
                
                {loading ? (
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[9/16] bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredShorts.map((short, index) => (
                            <VideoCard key={short.id} short={short} onClick={() => openPlayer(index)} />
                        ))}
                    </div>
                )}
            </div>

            {playerState.isOpen && filteredShorts.length > 0 && (
                <ImmersiveVideoPlayer
                    videos={filteredShorts}
                    startIndex={playerState.startIndex}
                    onClose={closePlayer}
                />
            )}
        </>
    );
};

export default VideoMomentsPage;