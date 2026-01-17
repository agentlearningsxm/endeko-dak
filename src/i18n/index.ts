import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nl from './locales/nl.json';
import en from './locales/en.json';

// Get saved language or default to Dutch
const savedLanguage = localStorage.getItem('endeko-language') || 'nl';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      nl: { translation: nl },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'nl',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
