
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

// Icons
import BedIcon from './icons/BedIcon';
import UtensilsCrossedIcon from './icons/UtensilsCrossedIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';


const QuickNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="group text-center">
        <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md group-hover:shadow-lg dark:shadow-black/20 transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95 group-hover:bg-brand-accent">
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8 text-brand-accent group-hover:text-white transition-colors duration-300" })}
            <span className="font-bold text-sm text-brand-text dark:text-gray-200 group-hover:text-white transition-colors duration-300">{label}</span>
        </div>
    </Link>
);

const MobileQuickNav: React.FC = () => {
    const { t, getLocalizedPath } = useTranslation();

    const navItems = [
        { to: getLocalizedPath('/accommodation'), icon: <BedIcon />, label: t('nav.accommodation') },
        { to: getLocalizedPath('/restaurants'), icon: <UtensilsCrossedIcon />, label: t('nav.whereToEat') },
        { to: getLocalizedPath('/gvg-play'), icon: <VideoCameraIcon />, label: t('nav.videoMoments') },
    ];

    return (
        <div className="md:hidden bg-brand-bg-light dark:bg-gray-900 pt-6 pb-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-3 gap-x-4">
                    {navItems.map(item => (
                        <QuickNavItem key={item.to} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileQuickNav;
