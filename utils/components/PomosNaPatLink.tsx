
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import WrenchIcon from './icons/WrenchIcon';
import TowTruckIcon from './icons/TowTruckIcon';
import TireIcon from './icons/TireIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

const PomosNaPatLink: React.FC = () => {
    const { t, getLocalizedPath } = useTranslation();

    return (
        <section className="py-8 md:py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop View */}
                <Link
                    to={getLocalizedPath("/pomos-na-pat")}
                    className="hidden sm:flex group flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 bg-brand-bg-light dark:bg-gray-900/50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                >
                    {/* Icons and Text */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        {/* Clustered Icons */}
                        <div className="relative flex-shrink-0 flex items-center justify-center w-24 h-16">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-md z-10 text-red-500 transition-transform duration-300 group-hover:-translate-x-2 group-hover:rotate-[-15deg]">
                                <TowTruckIcon className="w-7 h-7" />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-lg z-20 text-blue-500 transition-transform duration-300 group-hover:-translate-y-2">
                                <WrenchIcon className="w-6 h-6" />
                            </div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-md z-10 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-[15deg]">
                                <TireIcon className="w-7 h-7" />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-serif font-bold text-xl text-brand-text dark:text-gray-100 transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-500">
                                {t('homepage.pomosNaPatTitle')}
                            </h3>
                            <p className="hidden md:block text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {t('homepage.pomosNaPatSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0">
                         <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-2.5 px-5 rounded-lg shadow-md group-hover:shadow-lg transform group-hover:-translate-y-1 transition-all duration-300 group-hover:bg-red-700">
                            <span>{t('homepage.pomosNaPatCta')}</span>
                            <ChevronRightIcon className="w-5 h-5" />
                        </div>
                    </div>
                </Link>

                {/* Mobile View */}
                <Link to={getLocalizedPath("/pomos-na-pat")} className="block sm:hidden group relative rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                    <div className="aspect-[4/3]">
                        <img src="https://picsum.photos/seed/roadside-assist-dark/800/600" alt={t('homepage.pomosNaPatTitle')} className="absolute inset-0 w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    </div>
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                        <div>
                             <div className="relative w-24 h-12 mb-4">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full z-10 text-white">
                                    <TowTruckIcon className="w-6 h-6" />
                                </div>
                                <div className="absolute left-7 top-0 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full z-20 text-white">
                                    <WrenchIcon className="w-5 h-5" />
                                </div>
                                <div className="absolute left-14 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full z-10 text-white">
                                    <TireIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="font-serif font-bold text-2xl text-white drop-shadow-md">
                                {t('homepage.pomosNaPatTitle')}
                            </h3>
                            <p className="text-white/80 mt-1 drop-shadow-sm text-sm">
                                {t('homepage.pomosNaPatSubtitle')}
                            </p>
                        </div>
                        
                        <div className="self-start mt-4">
                             <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-2.5 px-5 rounded-lg shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                                <span>{t('homepage.pomosNaPatCta')}</span>
                                <ChevronRightIcon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default PomosNaPatLink;
