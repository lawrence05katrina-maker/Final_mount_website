import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.massBooking': 'Mass Booking',
    'nav.donations': 'Donations',
    'nav.gallery': 'Gallery',
    'nav.liveStream': 'Live Stream',
    'nav.testimonies': 'Testimonies',
    'nav.prayerRequest': 'Prayer Request',
    'nav.contact': 'Contact',
    'nav.language': 'Language',
    
    // Language options
    'lang.english': 'English',
    'lang.tamil': 'Tamil',
    
    // Hero Section
    'hero.title1': 'Martyr St.Devasahayam Shrine',
    'hero.title2': 'Our Lady Of Sorrows',
    'hero.subtitle': 'A Sacred Place of Prayer and Pilgrimage',
    'hero.bookMass': 'Book Mass',
    'hero.donate': 'Donate',
    'hero.prayerRequest': 'Prayer Request',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.about': 'பற்றி',
    'nav.massBooking': 'மிஸா முன்பதிவு',
    'nav.donations': 'நன்கொடைகள்',
    'nav.gallery': 'படக்காட்சி',
    'nav.liveStream': 'நேரடி ஒளிபரப்பு',
    'nav.testimonies': 'சாட்சியங்கள்',
    'nav.prayerRequest': 'ஜெப வேண்டுகோள்',
    'nav.contact': 'தொடர்பு',
    'nav.language': 'மொழி',
    
    // Language options
    'lang.english': 'ஆங்கிலம்',
    'lang.tamil': 'தமிழ்',
    
    // Hero Section
    'hero.title1': 'மறைசாட்சி புனித தேவசகாயம் ஆலயம்',
    'hero.title2': 'துக்கமாதா',
    'hero.subtitle': 'ஜெபம் மற்றும் யாத்திரையின் புனித இடம்',
    'hero.bookMass': 'மிஸா முன்பதிவு',
    'hero.donate': 'நன்கொடை',
    'hero.prayerRequest': 'ஜெப வேண்டுகோள்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('shrine-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ta')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shrine-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};