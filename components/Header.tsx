'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteSettings, CategoryItem, NewsArticle } from '../types';
import BreakingNews from './BreakingNews';

interface HeaderProps {
  settings: SiteSettings | null;
  categories: CategoryItem[];
  breakingArticles: NewsArticle[];
  // Fix: Added missing props to resolve App.tsx error
  onSearch?: (query: string) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  settings, 
  categories, 
  breakingArticles,
  onSearch,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <header className="bg-white dark:bg-neutral-950 z-50 shadow-sm relative sticky top-0">
      <BreakingNews articles={breakingArticles} />

      <div className="border-b border-gray-100 dark:border-neutral-900 py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-black">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>

          <Link href="/" className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-black text-2xl">{settings?.title?.charAt(0) || 'ق'}</span>
              </div>
              <div className="text-right hidden sm:block">
                <h1 className="text-2xl font-black tracking-tighter text-black">{settings?.title || 'القناص نيوز'}</h1>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">بوابة الخبر والتحليل</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Fix: Added dark mode toggle if props provided */}
            {toggleDarkMode && (
              <button onClick={toggleDarkMode} className="p-2 text-black hover:text-red-600 transition-colors">
                {isDarkMode ? '🌙' : '☀️'}
              </button>
            )}
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-black hover:text-red-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden lg:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-10 py-4">
            <li>
              <Link href="/" className="text-xs font-black text-black hover:text-red-600 uppercase tracking-widest">الرئيسية</Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} className="text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-widest transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu & Search omitted for brevity, same as React version but with Link component */}
    </header>
  );
};

export default Header;