
'use client';

import React from 'react';
import { NewsArticle } from '../types';

interface NewsGridProps {
  articles: NewsArticle[];
  onArticleClick?: (article: NewsArticle) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  articles, 
  onArticleClick, 
  onLoadMore, 
  hasMore = true, 
  loadingMore = false 
}) => {
  
  const ArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div 
      onClick={() => onArticleClick?.(article)} 
      className="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 shadow-premium hover:-translate-y-2 hover:shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="aspect-[16/9] overflow-hidden relative bg-slate-200 dark:bg-white/5">
        <img 
          loading="lazy" 
          src={article.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
          alt={article.title} 
        />
        <div className="absolute top-4 right-4 flex gap-2">
           <span className="bg-red-600/90 backdrop-blur-md text-white font-black text-[9px] px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-widest">{article.category}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{article.date}</span>
        </div>
        
        <h3 
          className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-[1.35] mb-6 group-hover:text-red-600 transition-colors line-clamp-3 tracking-tight" 
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          dangerouslySetInnerHTML={{ __html: article.title }} 
        />
        
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-black text-[10px] text-slate-500">
                {article.author.charAt(0)}
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{article.author}</span>
          </div>
          <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all group-hover:border-red-600">
             <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="flex items-end justify-between mb-16 gap-6 border-b-2 border-slate-100 dark:border-white/5 pb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
              نبض <span className="text-red-600">الحدث</span>
            </h2>
            <div className="w-32 h-2 bg-red-600 rounded-full"></div>
          </div>
          <div className="hidden md:flex gap-4">
             {['الكل', 'سياسة', 'اقتصاد', 'رياضة'].map(tab => (
               <button key={tab} className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'الكل' ? 'bg-red-600 text-white shadow-xl' : 'text-slate-400 hover:text-red-600'}`}>{tab}</button>
             ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-24 flex justify-center">
          <button 
            disabled={loadingMore}
            onClick={onLoadMore}
            className="group relative px-14 py-5 bg-slate-950 dark:bg-white overflow-hidden rounded-2xl transition-all active:scale-95 shadow-2xl"
          >
            <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-500 group-hover:w-full"></div>
            <span className="relative z-10 font-black text-xs uppercase tracking-[0.2em] text-white dark:text-slate-950 group-hover:text-white">
              {loadingMore ? 'جاري التحميل...' : 'اكتشف المزيد'}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsGrid;
