
import React from 'react';
import MapTourIcon from '../components/icons/MapTourIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../i18n';

const InteractiveMapPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumbs />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
          <div className="w-24 h-24 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-6">
              <MapTourIcon className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-text dark:text-gray-100 mb-4">{t('interactiveMapPage.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{t('interactiveMapPage.inDevelopment')}</p>
          <p className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-200 animate-pulse">{t('interactiveMapPage.comingSoon')}</p>
      </div>
    </>
  );
};

export default InteractiveMapPage;