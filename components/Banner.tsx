import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Banner as BannerType, MultiLangString } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface BannerProps {
  banner: BannerType;
}

const Banner: React.FC<BannerProps> = ({ banner }) => {
    const { language } = useTranslation();
    const lang = language as keyof MultiLangString;

    const { title, subtitle, ctaText, image, link } = banner.content;

    return (
        <section className="my-8 md:my-12">
            <Link to={link} className="block relative rounded-xl overflow-hidden group shine-effect shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <picture>
                    <source media="(min-width: 768px)" srcSet={image.desktop} />
                    <img 
                        src={image.mobile} 
                        alt={title[lang]} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-[4/3] md:aspect-[3/1]"
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                
                <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-center items-start text-white max-w-lg lg:max-w-xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black mb-3 drop-shadow-md animate-hero-fade-in" style={{ animationDelay: '0.2s' }}>
                        {title[lang]}
                    </h2>
                    <p className="text-sm md:text-base text-white/90 mb-6 drop-shadow-sm line-clamp-3 animate-hero-slide-up" style={{ animationDelay: '0.4s' }}>
                        {subtitle[lang]}
                    </p>
                    <div className="w-full sm:w-auto mt-auto animate-hero-slide-up text-left" style={{ animationDelay: '0.6s' }}>
                        <span className="inline-flex items-center gap-2 bg-brand-accent text-white font-bold py-3 px-6 rounded-lg group-hover:bg-orange-600 transition-colors duration-300 shadow-md group-hover:shadow-lg transform group-hover:-translate-y-0.5">
                            {ctaText[lang]}
                            <ChevronRightIcon className="w-5 h-5" />
                        </span>
                    </div>
                </div>
            </Link>
        </section>
    );
};

export default Banner;