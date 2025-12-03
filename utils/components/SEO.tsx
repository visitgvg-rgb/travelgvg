
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation, VALID_LANGUAGES } from '../i18n';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const SEO: React.FC<SEOProps> = ({ title, description, image, type = 'website' }) => {
  const { language } = useTranslation();
  const location = useLocation();
  
  const siteName = "Travel GVG";
  const siteNameShort = "TravelGVG";
  const defaultDescription = "Your complete guide through the heart of the south. Discover accommodations, restaurants, attractions, and more in Gevgelija.";
  
  // The current URL now correctly includes the language prefix from the browser because of the router structure.
  const currentUrl = window.location.origin + location.pathname;
  const defaultImage = `${window.location.origin}/images/hero-slider-gevgelija-01.webp`;

  // Logic to prevent double suffixing if the title already contains the site name (e.g. from translation files)
  let metaTitle;
  if (title) {
      if (title.includes(siteName) || title.includes(siteNameShort)) {
          metaTitle = title;
      } else {
          metaTitle = `${title} | ${siteName}`;
      }
  } else {
      metaTitle = `${siteName} - Tourist Portal Gevgelija`;
  }

  const metaDescription = description || defaultDescription;
  const metaImage = image ? (image.startsWith('http') ? image : `${window.location.origin}${image}`) : defaultImage;

  // Hreflang generation
  const getCanonicalUrl = (targetLang: string) => {
     // Current path: /en/restaurants or /mk/restaurants
     const pathSegments = location.pathname.split('/').filter(x => x);
     
     // Remove current lang prefix if exists (it should always exist now)
     if (VALID_LANGUAGES.includes(pathSegments[0])) {
         pathSegments.shift();
     }
     
     const corePath = pathSegments.join('/');
     // Construct with new lang prefix
     return `${window.location.origin}/${targetLang}/${corePath}`;
  };

  return (
    <Helmet>
      {/* Basic Metadata */}
      <html lang={language} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={language} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Hreflang Tags for SEO */}
      {VALID_LANGUAGES.map(lang => (
          <link key={lang} rel="alternate" hrefLang={lang} href={getCanonicalUrl(lang)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('mk')} />
    </Helmet>
  );
};

export default SEO;
