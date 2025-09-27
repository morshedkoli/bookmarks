"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en' or 'bn'
  const [isClient, setIsClient] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('bookmarks-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when changed
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('bookmarks-language', newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'bn' : 'en';
    changeLanguage(newLanguage);
  };

  // Helper function to get localized text
  const getLocalizedText = (textEn, textBn) => {
    if (language === 'bn' && textBn) {
      return textBn;
    }
    return textEn || textBn || '';
  };

  // Helper function to get category name based on current language
  const getCategoryName = (category) => {
    if (!category) return '';
    
    if (language === 'bn') {
      return category.nameBn || category.name || category.nameEn || '';
    }
    return category.nameEn || category.name || category.nameBn || '';
  };

  // Helper function to get category description based on current language
  const getCategoryDescription = (category) => {
    if (!category) return '';
    
    if (language === 'bn') {
      return category.descriptionBn || category.description || category.descriptionEn || '';
    }
    return category.descriptionEn || category.description || category.descriptionBn || '';
  };

  // Helper function to get website name based on current language
  const getWebsiteName = (website) => {
    if (!website) return '';
    
    if (language === 'bn') {
      return website.nameBn || website.name || website.nameEn || '';
    }
    return website.nameEn || website.name || website.nameBn || '';
  };

  // Helper function to get website description/useFor based on current language
  const getWebsiteDescription = (website) => {
    if (!website) return '';
    
    if (language === 'bn') {
      return website.useForBn || website.useFor || website.useForEn || '';
    }
    return website.useForEn || website.useFor || website.useForBn || '';
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    toggleLanguage,
    isEnglish: language === 'en',
    isBengali: language === 'bn',
    isClient,
    getLocalizedText,
    getCategoryName,
    getCategoryDescription,
    getWebsiteName,
    getWebsiteDescription,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
