
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import type { Short } from '../types';
import VideoShortCard from './VideoShortCard';
import VideoModal from './VideoModal';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { Link } from 'react-router-dom';

const SectionHeader: React.FC<{ to: string, title: string, description: string }> = ({ to, title, description }) => (
    <Link to={to} className="group block text-left mb-8">
        <h2 className="inline-flex items-center text-2xl md:text-4xl font-serif font-bold text-brand-text dark:text-gray-100 mb-3 group-hover:text-brand-accent transition-colors duration-300">
            <span>{title}</span>
            <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-300 block md:hidden" />
        </h2>
        <div className="hidden md:block w-24 h-1 bg-brand-accent rounded mr-auto group-hover:w-28 transition-all duration-300"></div>
        <p className="hidden md:block text-left text-gray-600 dark:text-gray-300 mt-6 max-w-2xl">{description}</p>
    </Link>
);

const ShortsSection: React.FC = () => {
    const { t, getLocalizedPath } = useTranslation();
    const [shorts, setShorts] = useState<Short[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShort, setSelectedShort] = useState<Short | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(true);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const response = await fetch('/data/shorts.json');
                const data: Short[] = await response.json();
                setShorts(data.filter(short => short.featured));
            } catch (error) {
                console.error("Failed to fetch shorts data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowPrev(scrollLeft > 10);
            setShowNext(scrollWidth - clientWidth - scrollLeft > 10);
        }
    };

    const scroll = (direction: 'prev' | 'next') => {
        if (sliderRef.current) {
            const cardWidth = sliderRef.current.querySelector('div')?.clientWidth || 0;
            const scrollAmount = cardWidth * 2.5;
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
            const resizeObserver = new ResizeObserver(handleScroll);
            resizeObserver.observe(slider);

            return () => {
                slider.removeEventListener('scroll', handleScroll);
                resizeObserver.disconnect();
            };
        }
    }, [loading]);

    const SkeletonCard = () => (
        <div className="aspect-[9/16] w-52 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
    );

    return (
        <section className="py-8 md:py-16 bg-brand-bg-light dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    to={getLocalizedPath("/gvg-play")}
                    title={t('homepage.gvgMomentsTitle')} 
                    description={t('homepage.gvgMomentsSubtitle')} 
                />
                <div className="relative">
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto scroll-smooth hide-scrollbar -mx-4 px-4 snap-x snap-mandatory space-x-4 md:space-x-6 pb-4"
                    >
                        {loading ? (
                            [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
                        ) : (
                            shorts.map(short => (
                                <VideoShortCard
                                    key={short.id}
                                    short={short}
                                    onPlayClick={() => setSelectedShort(short)}
                                />
                            ))
                        )}
                    </div>
                    {showPrev && (
                        <button
                            onClick={() => scroll('prev')}
                            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 hidden md:block z-10"
                            aria-label="Previous videos"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                    {showNext && (
                        <button
                            onClick={() => scroll('next')}
                            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 hidden md:block z-10"
                            aria-label="Next videos"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
            {selectedShort && (
                <VideoModal
                    short={selectedShort}
                    onClose={() => setSelectedShort(null)}
                />
            )}
        </section>
    );
};

export default ShortsSection;
