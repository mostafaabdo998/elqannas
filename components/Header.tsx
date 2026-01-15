
'use client';

import React, { useState, useEffect } from 'react';
import { SiteSettings, CategoryItem, NewsArticle } from '../types';
import BreakingNews from './BreakingNews';

interface HeaderProps {
  settings: SiteSettings | null;
  categories: CategoryItem[];
  breakingArticles: NewsArticle[];
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  onCategoryClick?: (cat: CategoryItem) => void;
  onHomeClick?: () => void;
  onDashboardOpen?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  categories, 
  breakingArticles,
  isDarkMode,
  toggleDarkMode,
  onCategoryClick,
  onHomeClick,
  onDashboardOpen
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'glass-effect py-2 shadow-sm' : 'bg-white dark:bg-midnight py-4'}`}>
      <BreakingNews articles={breakingArticles} />

      <div className="container mx-auto px-6 flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode} 
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center hover:bg-red-600 group transition-all"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4 text-yellow-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
          
          <button 
            onClick={onDashboardOpen}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg"
          >
            <span>إدارة</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>

        <button onClick={onHomeClick} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20 group-hover:rotate-6 transition-transform">
            <span className="font-black text-xl">ق</span>
          </div>
          <div className="hidden sm:block text-right">
            <h1 className="text-lg font-black tracking-tight dark:text-white leading-none">القناص <span className="text-red-600">نيوز</span></h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">بوابتك الإخبارية</p>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-6">
          {categories.slice(0, 5).map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => onCategoryClick?.(cat)}
              className="text-[10px] font-black text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-white uppercase tracking-widest transition-all"
            >
              {cat.name}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-100 dark:bg-white/10 mx-2"></div>
          <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
