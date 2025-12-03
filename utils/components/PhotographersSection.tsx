
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Photographer, MultiLangString } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

const PhotographersSection: React.FC = () => {
    const { t, language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;
    const [photographers, setPhotographers] = useState<Photographer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotographers = async () => {
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

    const topPhotographers = photographers.slice(0, 3);

    return (
        <section 
            className="py-8 md:py-16 bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: `url(/images/homepage-tsx/photographers-homepage-background.webp)` }}
        >
            <div className="absolute inset-0 bg-slate-900/60"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
                    
                    {/* Image Collage - Desktop */}
                    <div className="hidden md:block">
                        {loading ? (
                            <div className="h-80 bg-gray-700/50 rounded-lg animate-pulse"></div>
                        ) : (
                            topPhotographers.length >= 3 && (
                                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-80">
                                    <Link to={getLocalizedPath(`/photographers/${topPhotographers[0].id}`)} className="col-span-1 row-span-2 relative group overflow-hidden rounded-lg shadow-lg border border-white block h-full w-full">
                                        <img src={topPhotographers[0].gallery[0]} alt={topPhotographers[0].name[lang]} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                                    </Link>
                                    <Link to={getLocalizedPath(`/photographers/${topPhotographers[1].id}`)} className="col-span-1 row-span-1 relative group overflow-hidden rounded-lg shadow-lg border border-white block h-full w-full">
                                        <img src={topPhotographers[1].gallery[0]} alt={topPhotographers[1].name[lang]} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                                    </Link>
                                    <Link to={getLocalizedPath(`/photographers/${topPhotographers[2].id}`)} className="col-span-1 row-span-1 relative group overflow-hidden rounded-lg shadow-lg border border-white block h-full w-full">
                                        <img src={topPhotographers[2].gallery[0]} alt={topPhotographers[2].name[lang]} className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" />
                                    </Link>
                                </div>
                            )
                        )}
                    </div>

                    {/* Text Content and Mobile Images */}
                    <div className="text-left">
                        <Link to={getLocalizedPath("/photographers")} className="group">
                            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3 drop-shadow-md group-hover:text-brand-accent transition-colors duration-300">
                                <span>{t('homepage.photographersSection.title')}</span>
                            </h2>
                        </Link>
                        <div className="hidden md:block w-24 h-1 bg-brand-accent rounded mr-auto"></div>
                        <p className="hidden md:block text-lg text-gray-200 my-8 drop-shadow">{t('homepage.photographersSection.subtitle')}</p>

                        {/* Mobile Image Row */}
                        <div className="md:hidden flex justify-center space-x-3 mt-8 mb-8">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1/3 aspect-square bg-gray-700/50 rounded-md shadow-lg animate-pulse"></div>
                                ))
                            ) : (
                                topPhotographers.map((p, i) => (
                                    <Link key={p.id} to={getLocalizedPath(`/photographers/${p.id}`)} className="w-1/3 aspect-square p-0.5 bg-white dark:bg-white/50 rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 block relative overflow-hidden">
                                        <img src={p.gallery[0]} alt={p.name[lang]} className="w-full h-full object-cover rounded-sm" />
                                    </Link>
                                ))
                            )}
                        </div>
                        
                        <Link 
                            to={getLocalizedPath("/photographers")}
                            className="inline-block bg-brand-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            {t('homepage.photographersSection.cta')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PhotographersSection;
