
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import SearchIcon from './icons/SearchIcon';
import { useTranslation } from '../i18n';
import SearchModal from './SearchModal';

const HeroSlider: React.FC = () => {
    const { t, language, getLocalizedPath } = useTranslation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const slides = [
        {
            image: 'images/hero-slider-gevgelija-01.webp',
            title: t('homepage.heroTitle1'),
            subtitle: t('homepage.heroSubtitle1'),
            ctaText: t('homepage.heroCta1'),
            link: getLocalizedPath('/stories')
        },
        {
            image: 'images/hero-slider-accommodation-01.webp',
            title: t('homepage.heroTitle2'),
            subtitle: t('homepage.heroSubtitle2'),
            ctaText: t('homepage.heroCta2'),
            link: getLocalizedPath('/accommodation')
        },
        {
            image: 'images/hero-slider-restaurants-01.webp',
            title: t('homepage.heroTitle3'),
            subtitle: t('homepage.heroSubtitle3'),
            ctaText: t('homepage.heroCta3'),
            link: getLocalizedPath('/restaurants')
        }
    ];

    const searchPlaceholder: { [key: string]: string } = {
        mk: "Пребарај тука...",
        en: "Search here...",
        sr: "Pretraži ovde...",
        el: "Αναζήτηση εδώ..."
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    const handlePrevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        prevSlide();
    };

    const handleNextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        nextSlide();
    };

    // Pause controls
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setIsPaused(false);

        if (touchStart === null) {
            return;
        }
        
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;

        if (distance > minSwipeDistance) {
            nextSlide();
        } else if (distance < -minSwipeDistance) {
            prevSlide();
        }

        setTouchStart(null);
    };

    return (
        <div 
            className="relative h-[60vh] min-h-[450px] md:min-h-0 md:h-auto md:aspect-video w-full overflow-hidden" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Slides container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img 
                            src={slide.image} 
                            alt={`Slide ${index + 1}`} 
                            className="w-full h-full object-cover" 
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 pb-32 pt-4 md:p-4">
                 {/* This div gets a key that changes with the slide, forcing React to re-render it and trigger the animations */}
                 <div key={currentSlide} className="max-w-4xl mx-auto flex flex-col items-center">
                    
                    {/* 1. Integrated Search Bar (Now at the top) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsSearchOpen(true); }}
                        className="w-full max-w-xs md:max-w-md flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 text-left text-white shadow-lg hover:bg-white/30 transition-all cursor-text mb-8 md:mb-12 animate-hero-slide-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <SearchIcon className="w-5 h-5 text-white/90" />
                        <span className="text-white/80 text-sm font-medium">{searchPlaceholder[language as keyof typeof searchPlaceholder]}</span>
                    </button>

                    {/* 2. Main Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-4 animate-hero-fade-in" style={{ animationDelay: '0.2s' }}>
                        {slides[currentSlide].title}
                    </h1>

                    {/* 3. Subtitle - HIDDEN ON MOBILE (hidden md:block) */}
                    <p className="hidden md:block text-base md:text-lg max-w-2xl mx-auto mb-8 animate-hero-slide-up" style={{ animationDelay: '0.3s' }}>
                        {slides[currentSlide].subtitle}
                    </p>

                    {/* 4. CTA Button - HIDDEN ON MOBILE */}
                    <div className="hidden md:block animate-hero-slide-up" style={{ animationDelay: '0.4s' }}>
                        <Link 
                            to={slides[currentSlide].link}
                            className="inline-block bg-brand-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {slides[currentSlide].ctaText}
                        </Link>
                    </div>
                 </div>
            </div>
            
            {/* Navigation Arrows */}
            <button onClick={handlePrevSlide} className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10" aria-label="Previous slide">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button onClick={handleNextSlide} className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10" aria-label="Next slide">
                <ChevronRightIcon className="w-6 h-6" />
            </button>


            {/* Story-Style Progress Indicators (Replaces Dots) */}
            <div className="absolute bottom-8 md:bottom-24 left-0 right-0 px-4 flex space-x-1.5 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                        className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:h-1 group"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div
                            className={`h-full bg-white rounded-full ${
                                index === currentSlide 
                                    ? 'animate-story-progress w-0' // Current: Animate from 0 to 100
                                    : index < currentSlide 
                                        ? 'w-full' // Passed: 100% width
                                        : 'w-0'    // Future: 0% width
                            }`}
                            style={index === currentSlide ? { animationPlayState: isPaused ? 'paused' : 'running' } : {}}
                            onAnimationEnd={() => {
                                if (index === currentSlide) {
                                    nextSlide();
                                }
                            }}
                        ></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
