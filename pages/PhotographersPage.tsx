
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Photographer, MultiLangString } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import PhotographerCard from '../components/PhotographerCard';
import CameraIcon from '../components/icons/CameraIcon';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import InstagramIcon from '../components/icons/InstagramIcon';
import FacebookIcon from '../components/icons/FacebookIcon';
import SEO from '../components/SEO';

const PhotographersPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;
    const navigate = useNavigate();

    const [photographers, setPhotographers] = useState<Photographer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const selectedPhotographer = id ? photographers.find(p => p.id === id) : null;

    useEffect(() => {
        const fetchPhotographers = async () => {
            setLoading(true);
            try {
                const response = await fetch('/data/photographers.json');
                const data: Photographer[] = await response.json();
                setPhotographers(data);
            } catch (error) {
                console.error("Failed to fetch photographers data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotographers();
    }, []);

    // Lightbox handlers
    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => setIsLightboxOpen(false);

    const showNextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedPhotographer) return;
        setSelectedImageIndex(prev => (prev + 1) % selectedPhotographer.gallery.length);
    }, [selectedPhotographer]);

    const showPrevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedPhotographer) return;
        setSelectedImageIndex(prev => (prev - 1 + selectedPhotographer.gallery.length) % selectedPhotographer.gallery.length);
    }, [selectedPhotographer]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, showNextImage, showPrevImage]);


    const MainGalleryView = () => (
        <>
            <div className="relative bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 py-20 md:py-32 px-4 sm:px-6 lg:px-8 text-center text-white mb-12 shadow-inner">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/homepage-tsx/photographers-homepage-background.webp" 
                        alt="" 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="relative z-10">
                    <CameraIcon className="w-16 h-16 text-brand-accent mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-serif font-black drop-shadow-lg">{t('photographersPage.title')}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200 drop-shadow">{t('photographersPage.intro')}</p>
                </div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse aspect-[3/4] bg-gray-300 dark:bg-gray-700 rounded-lg break-inside-avoid"></div>
                    ))
                ) : (
                    photographers.map(p => (
                        <div key={p.id} className="break-inside-avoid">
                            <PhotographerCard 
                                photographer={p} 
                                onClick={() => navigate(getLocalizedPath(`/photographers/${p.id}`))} 
                            />
                        </div>
                    ))
                )}
            </div>
        </>
    );

    const DetailView = () => {
        if (loading) {
             return (
                <div className="max-w-7xl mx-auto animate-pulse">
                    <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12 p-8 bg-gray-200 dark:bg-gray-800 rounded-lg">
                        <div className="w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                        <div className="flex-grow w-full">
                            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                            <div className="flex gap-5">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-8"></div>
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {[...Array(8)].map((_, i) => <div key={i} className={`h-48 md:h-64 bg-gray-300 dark:bg-gray-700 rounded-lg ${i % 2 === 0 ? 'h-56' : ''}`}></div>)}
                    </div>
                </div>
            );
        }
        if (!selectedPhotographer) {
            return (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold">Photographer Not Found</h2>
                    <Link to={getLocalizedPath("/photographers")} className="mt-4 inline-block text-brand-accent hover:underline">
                        {t('photographersPage.backToGallery')}
                    </Link>
                </div>
            );
        }

        return (
            <div className="max-w-7xl mx-auto">
                <Link to={getLocalizedPath("/photographers")} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent transition-colors mb-6 group">
                    <div className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-brand-accent/10 dark:group-hover:bg-brand-accent/20 transition-colors">
                      <ChevronLeftIcon className="w-5 h-5" />
                    </div>
                    {t('photographersPage.backToGallery')}
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 mb-12 overflow-hidden relative">
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-accent/5 rounded-full"></div>
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-accent/5 rounded-full"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                        <img src={selectedPhotographer.portraitImage} alt={selectedPhotographer.name[lang]} className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-xl flex-shrink-0 border-4 border-white dark:border-gray-700" />
                        <div className="text-center md:text-left pt-4">
                            <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-gray-100">{selectedPhotographer.name[lang]}</h1>
                            <div className="w-20 h-1 bg-brand-accent my-4 mx-auto md:mx-0"></div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl">{selectedPhotographer.bio[lang]}</p>
                            <div className="mt-6 flex justify-center md:justify-start items-center gap-5">
                                {selectedPhotographer.socials.instagram && (
                                    <a href={selectedPhotographer.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"><InstagramIcon className="w-7 h-7" /></a>
                                )}
                                 {selectedPhotographer.socials.facebook && (
                                    <a href={selectedPhotographer.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><FacebookIcon className="w-7 h-7" /></a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-center text-brand-text dark:text-gray-100 mb-8">{selectedPhotographer.season[lang]}</h2>
                
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {selectedPhotographer.gallery.map((img, index) => (
                        <div key={index} className="break-inside-avoid" onClick={() => openLightbox(index)}>
                            <img src={img} alt={`${selectedPhotographer.name[lang]} - photo ${index + 1}`} className="w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" />
                        </div>
                    ))}
                </div>

                {isLightboxOpen && (
                    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={closeLightbox}>
                         <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] transition-colors" aria-label="Close">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors" aria-label="Previous"><ChevronLeftIcon className="w-8 h-8" /></button>
                        <div className="relative" onClick={e => e.stopPropagation()}>
                            <img key={selectedImageIndex} src={selectedPhotographer.gallery[selectedImageIndex]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg animate-zoom-slide-up" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-semibold">{selectedImageIndex + 1} / {selectedPhotographer.gallery.length}</div>
                        </div>
                        <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors" aria-label="Next"><ChevronRightIcon className="w-8 h-8" /></button>
                    </div>
                )}
            </div>
        );
    }


    return (
        <div className="bg-brand-bg-light dark:bg-gray-900">
            <SEO title={selectedPhotographer ? selectedPhotographer.name[lang] : t('seo.photographers')} />
            <Breadcrumbs customLastSegment={selectedPhotographer ? selectedPhotographer.name[lang] : undefined} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
                {id ? <DetailView /> : <MainGalleryView />}
            </div>
        </div>
    );
};

export default PhotographersPage;
