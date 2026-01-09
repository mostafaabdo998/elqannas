
import React, { useState } from 'react';
import { SiteSettings, CategoryItem, NewsArticle } from '../types';
import BreakingNews from './BreakingNews';

interface HeaderProps {
  settings: SiteSettings | null;
  categories: CategoryItem[];
  breakingArticles: NewsArticle[];
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ settings, categories, breakingArticles, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSearch(false);
    window.location.hash = '/';
  };

  return (
    <header className="bg-white z-50 shadow-sm relative">
      <BreakingNews articles={breakingArticles} />

      <div className="border-b border-gray-100 bg-white py-6 md:py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-600 hover:text-red-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>

          <div className="flex flex-col items-center cursor-pointer flex-1" onClick={() => window.location.hash = '/'}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                <span className="font-black text-2xl md:text-3xl">{settings?.title?.charAt(0) || 'ق'}</span>
              </div>
              <div className="text-right hidden sm:block">
                <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-gray-900 leading-none">{settings?.title || 'القناص نيوز'}</h1>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest opacity-80 mt-1">بوابة الخبر والتحليل</p>
              </div>
            </div>
          </div>

          <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>

      <nav className="hidden lg:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            <li>
              <a href="#/" className="text-xs font-black text-gray-900 hover:text-red-600 transition-colors uppercase tracking-widest">الرئيسية</a>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <a href={`#category/${cat.slug}`} className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors uppercase tracking-widest">
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 animate-in slide-in-from-top duration-300 z-40 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="container mx-auto max-w-2xl flex gap-2">
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text" 
              placeholder="عن ماذا تبحث اليوم؟" 
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
            <button type="submit" className="bg-red-600 text-white px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20">بحث</button>
          </form>
        </div>
      )}

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[100] p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="text-2xl font-black text-red-600">الأقسام</div>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <a onClick={() => setIsOpen(false)} href="#/" className="text-2xl font-black text-gray-900 py-3 border-b border-gray-50">الرئيسية</a>
            {categories.map(cat => (
              <a onClick={() => setIsOpen(false)} key={cat.id} href={`#category/${cat.slug}`} className="text-xl font-bold text-gray-600 py-3 border-b border-gray-50">
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
