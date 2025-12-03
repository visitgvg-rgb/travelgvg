
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { useTranslation } from '../i18n';

const pathKeyMap: { [key: string]: string } = {
  accommodation: 'nav.accommodation',
  restaurants: 'nav.whereToEat',
  shopping: 'nav.shoppingGuide',
  entertainment: 'nav.entertainment',
  attractions: 'nav.localAttractions',
  'wine-paradise': 'nav.wineParadise',
  'pomos-na-pat': 'nav.roadsideAssistance',
  'special-offers': 'nav.specialOffers',
  stories: 'nav.stories',
  events: 'nav.events',
  'interactive-map': 'nav.interactiveMap',
  favorites: 'nav.favorites',
  photographers: 'nav.photographersCorner',
  faq: 'nav.faq',
  'terms-of-use': 'nav.termsOfUse',
  'gas-stations': 'nav.gasStations'
};

const Breadcrumbs: React.FC<{ customLastSegment?: string; backgroundClass?: string }> = ({ customLastSegment, backgroundClass = 'bg-brand-bg-light dark:bg-gray-900' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const linkColor = 'text-gray-500 dark:text-gray-400 hover:text-brand-accent dark:hover:text-white';
  const textColor = 'text-brand-text dark:text-white';

  return (
    <nav aria-label="breadcrumb" className={`${backgroundClass} hidden sm:block`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm py-3">
          <li>
            <Link to="/" className={`transition-colors ${linkColor}`}>
              {t('breadcrumbs.home')}
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const name = pathKeyMap[value] ? t(pathKeyMap[value]) : (customLastSegment && isLast ? customLastSegment : value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '));
            
            // Do not render breadcrumb for dynamic ID segments like story IDs or photographer IDs
            if (!pathKeyMap[value] && !isLast) return null;

            return (
              <li key={to} className="flex items-center">
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className={`ml-2 font-semibold ${textColor}`}>{name}</span>
                ) : (
                  <Link to={to} className={`ml-2 transition-colors ${linkColor}`}>
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
