"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { siteConfig, SiteId, LanguageId } from '@/lib/siteConfig';

interface SiteContextType {
  activeSite: SiteId;
  language: LanguageId;
  siteData: typeof siteConfig['grill'];
  content: typeof siteConfig['grill']['de'];
  toggleSite: () => void;
  toggleLanguage: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [activeSite, setActiveSite] = useState<SiteId>('grill');
  const [language, setLanguage] = useState<LanguageId>('de');

  const toggleSite = () => {
    setActiveSite((prev: SiteId) => (prev === 'grill' ? 'sweets' : 'grill'));
  };

  const toggleLanguage = () => {
    setLanguage((prev: LanguageId) => (prev === 'de' ? 'en' : 'de'));
  };

  const siteData = siteConfig[activeSite];
  const content = siteData[language];

  return (
    <SiteContext.Provider value={{ activeSite, language, siteData, content, toggleSite, toggleLanguage }}>
      <div className={`min-h-screen transition-colors duration-500 font-sans ${siteData.colors.bg} ${siteData.colors.text}`}>
        {children}
      </div>
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};