
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings, CategoryItem, NewsArticle } from '../types';
import BreakingNews from './BreakingNews';

interface HeaderProps {
  settings: SiteSettings | null;
  categories: CategoryItem[];
  breakingArticles: NewsArticle[];
  onSearch?: (query: string) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  settings, 
  categories, 
  breakingArticles,
  isDarkMode,
  toggleDarkMode
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'glass-effect py-2 shadow-xl' : 'bg-white dark:bg-midnight py-4'}`}>
      <BreakingNews articles={breakingArticles} />

      <div className="container mx-auto px-6 flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode} 
            className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center hover:bg-brand-red group transition-all"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
        </div>

        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-red/30 transition-transform group-hover:rotate-6">
            <span className="font-black text-2xl">ق</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tight dark:text-white leading-none">القناص <span className="text-brand-red">نيوز</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">THE ELQANNAS NETWORK</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {categories.slice(0, 5).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className="text-[11px] font-bold text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-white uppercase tracking-widest transition-all"
            >
              {cat.name}
            </Link>
          ))}
          <button className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
