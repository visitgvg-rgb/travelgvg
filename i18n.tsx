
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Define the shape of the context
interface LanguageContextType {
  language: string;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  getLocalizedPath: (path: string, targetLang?: string) => string;
  changeLanguage: (lang: string) => void;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const VALID_LANGUAGES = ['mk', 'en', 'sr', 'el'];
export const DEFAULT_LANGUAGE = 'mk';

// Simple, elegant loading spinner component
const GlobalLoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg-light dark:bg-gray-900 transition-opacity duration-300">
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-accent rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  </div>
);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [translations, setTranslations] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Extract language from URL param (provided by App.tsx :lang route)
  // If undefined (loading state), fallback to default
  const currentLanguage = (params.lang as string) || DEFAULT_LANGUAGE;

  useEffect(() => {
    // Validate language from URL, if invalid, it's handled in App.tsx via redirect
    if (!VALID_LANGUAGES.includes(currentLanguage)) return;

    const fetchTranslations = async () => {
      // Only set loading if we don't have this language cached
      if (!translations[currentLanguage]) {
        setLoading(true);
      }
      
      try {
        const response = await fetch(`/locales/${currentLanguage}/translation.json`);
        const data = await response.json();
        setTranslations((prev: any) => ({
            ...prev,
            [currentLanguage]: data
        }));
      } catch (error) {
        console.error(`Could not load translations for ${currentLanguage}`, error);
      } finally {
        // Add a small delay to ensure smooth transition and prevent flickering for fast connections
        setTimeout(() => setLoading(false), 50);
      }
    };
    
    fetchTranslations();
    
    // Store preference
    localStorage.setItem('appLanguage', currentLanguage);
  }, [currentLanguage]);

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    const currentDict = translations[currentLanguage];
    if (!currentDict) return ''; 

    const keys = key.split('.');
    let result: any = currentDict;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    let finalString = typeof result === 'string' ? result : key;

    if (options) {
      Object.keys(options).forEach(optKey => {
        finalString = finalString.replace(new RegExp(`{{${optKey}}}`, 'g'), String(options[optKey]));
      });
    }

    return finalString;
  };

  // Generates a URL with the enforced language prefix
  const getLocalizedPath = (path: string, targetLang?: string): string => {
    const langToUse = targetLang || currentLanguage;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // Always include prefix: /mk/home, /en/home, etc.
    // If path is root '/', result is '/mk'
    if (cleanPath === '/') {
        return `/${langToUse}`;
    }

    return `/${langToUse}${cleanPath}`;
  };

  const changeLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    
    // Split current path to replace the first segment
    // /en/restaurants -> ['', 'en', 'restaurants']
    const pathSegments = location.pathname.split('/').filter(x => x);
    
    // Replace the first segment (which is the language) with new lang
    if (VALID_LANGUAGES.includes(pathSegments[0])) {
        pathSegments[0] = lang;
    } else {
        // Fallback for safety, though routing should prevent this
        pathSegments.unshift(lang);
    }

    const newPathStr = '/' + pathSegments.join('/') + location.search;
    navigate(newPathStr);
  };
  
  const value = {
    language: currentLanguage,
    t,
    getLocalizedPath,
    changeLanguage
  };

  // Prevent rendering children until translations are loaded to avoid "orange balls" / empty UI
  if (loading) {
    return <GlobalLoadingSpinner />;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
