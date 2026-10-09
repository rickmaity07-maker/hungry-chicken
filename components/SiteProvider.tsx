"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const [restored, setRestored] = useState(false);

  // Remember the visitor's section + language across reloads. This is
  // functional localStorage (no tracking), so it needs no consent.
  useEffect(() => {
    try {
      const site = localStorage.getItem('hc-site');
      const lang = localStorage.getItem('hc-lang');
      if (site === 'grill' || site === 'sweets') setActiveSite(site);
      if (lang === 'de' || lang === 'en') setLanguage(lang);
    } catch {}
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem('hc-site', activeSite);
      localStorage.setItem('hc-lang', language);
    } catch {}
  }, [activeSite, language, restored]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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