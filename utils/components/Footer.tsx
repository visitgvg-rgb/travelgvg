
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import MailIcon from './icons/MailIcon';
import PhoneIcon from './icons/PhoneIcon';
import { useTranslation } from '../i18n';
import SunIcon from './icons/SunIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

const Footer: React.FC = () => {
  const { t, getLocalizedPath } = useTranslation();
  const location = useLocation();
  const [isAppMode, setIsAppMode] = useState(false);

  useEffect(() => {
    const checkMode = () => {
      const mode = localStorage.getItem('mobileViewMode');
      setIsAppMode(mode === 'app');
    };
    
    checkMode();
    window.addEventListener('mobileViewModeChanged', checkMode);
    return () => window.removeEventListener('mobileViewModeChanged', checkMode);
  }, []);

  // Check if current path matches homepage for any supported language
  const path = location.pathname.replace(/\/$/, '');
  const isHomePage = path === '/' || ['/mk', '/en', '/sr', '/el'].includes(path);

  if (isHomePage && isAppMode) {
    return null;
  }

  return (
    <footer className="relative z-10 bg-gray-900 text-gray-300 pt-16 pb-8 overflow-hidden mt-16">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-accent via-brand-yellow to-brand-accent opacity-80"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Branding */}
          <div className="lg:col-span-4 space-y-6">
            <Link to={getLocalizedPath('/')} className="flex items-center gap-2 inline-block group">
                <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                    <SunIcon className="w-8 h-8 text-brand-yellow" />
                </div>
                <div className="flex items-baseline">
                    <span className="text-2xl font-sans font-normal text-white tracking-tight">Travel</span>
                    <span className="text-2xl font-serif font-extrabold text-brand-accent tracking-tighter">GVG</span>
                </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-gray-800 hover:bg-blue-600 text-white p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-gray-800 hover:bg-pink-600 text-white p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1">
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Nav */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold font-serif mb-6 tracking-wide border-b border-gray-800 pb-2 inline-block">{t('footer.quickNav')}</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/accommodation', label: t('nav.accommodation') },
                { to: '/restaurants', label: t('nav.whereToEat') },
                { to: '/shopping', label: t('nav.shoppingGuide') },
                { to: '/entertainment', label: t('nav.entertainment') },
                { to: '/attractions', label: t('nav.localAttractions') }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={getLocalizedPath(link.to)} className="flex items-center group hover:text-brand-accent transition-colors">
                    <ChevronRightIcon className="w-3 h-3 mr-2 text-gray-600 group-hover:text-brand-accent transition-all group-hover:translate-x-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold font-serif mb-6 tracking-wide border-b border-gray-800 pb-2 inline-block">{t('nav.explore')}</h3>
            <ul className="space-y-3 text-sm">
               {[
                { to: '/wine-paradise', label: t('nav.wineParadise') },
                { to: '/stories', label: t('nav.stories') },
                { to: '/special-offers', label: t('nav.specialOffers') },
                { to: '/pomos-na-pat', label: t('nav.roadsideAssistance') },
                { to: '/faq', label: t('nav.faq') },
                { to: '/terms-of-use', label: t('nav.termsOfUse') }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={getLocalizedPath(link.to)} className="flex items-center group hover:text-brand-accent transition-colors">
                    <ChevronRightIcon className="w-3 h-3 mr-2 text-gray-600 group-hover:text-brand-accent transition-all group-hover:translate-x-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Business Card */}
          <div className="lg:col-span-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-colors duration-300">
                <h3 className="text-white font-bold font-serif mb-2 text-lg">{t('footer.forBusinesses')}</h3>
                <p className="text-gray-400 text-sm mb-6">{t('footer.forBusinessesDesc')}</p>
                
                <div className="space-y-4 mb-6">
                   <div className="flex items-center text-sm group">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-brand-accent/20 transition-colors">
                        <PhoneIcon className="w-4 h-4 text-brand-accent" />
                    </div>
                    <a href="tel:+38971566000" className="text-gray-300 hover:text-white transition-colors font-semibold">071 566 000</a>
                  </div>
                  <div className="flex items-center text-sm group">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-brand-accent/20 transition-colors">
                        <MailIcon className="w-4 h-4 text-brand-accent" />
                    </div>
                    <a href="mailto:travelgvg.mk@gmail.com" className="text-gray-300 hover:text-white transition-colors">travelgvg.mk@gmail.com</a>
                  </div>
                </div>

                <a 
                  href="mailto:travelgvg.mk@gmail.com?subject=Сакам да огласувам на TravelGVG" 
                  className="block w-full text-center bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5"
                >
                  {t('footer.advertise')}
                </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{t('footer.copyright', { year: 2025 })}</p>
          <div className="flex items-center gap-6">
             <span>Made with ❤️ in Gevgelija</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
