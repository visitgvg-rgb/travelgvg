
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['mk', 'en', 'sr', 'el'];
const DEFAULT_LANGUAGE = 'mk';

const LanguageRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check local storage preference
    const storedLang = localStorage.getItem('appLanguage');
    
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      navigate(`/${storedLang}`, { replace: true });
      return;
    }

    // 2. Check browser language
    const browserLang = navigator.language.split('-')[0];
    const targetLang = SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;

    navigate(`/${targetLang}`, { replace: true });
  }, [navigate]);

  return null;
};

export default LanguageRedirect;
