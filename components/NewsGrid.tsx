'use client';

import React from 'react';
import { NewsArticle } from '../types';
import AdUnit from './AdUnit';

interface NewsGridProps {
  articles: NewsArticle[];
  // Fix: Made onArticleClick optional to resolve missing prop error in app/page.tsx
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
  
  if (articles.length === 0 && !loadingMore) return (
    <div className="py-40 text-center text-gray-300 font-black uppercase tracking-[0.3em] text-sm">
      لا توجد نتائج مطابقة لبحثك
    </div>
  );

  const ArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    // Fix: Used optional chaining for onArticleClick
    <div onClick={() => onArticleClick?.(article)} className="group cursor-pointer">
      <div className="aspect-[4/3] rounded-[3rem] overflow-hidden mb-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-50 dark:border-neutral-900 relative bg-gray-50 dark:bg-neutral-900">
        <img loading="lazy" src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" alt="" />
        <div className="absolute top-6 right-6">
           <span className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl text-red-600 font-black text-[10px] px-5 py-2.5 rounded-full shadow-2xl border border-white/20 uppercase tracking-widest">{article.category}</span>
        </div>
      </div>
      <div className="px-4">
        <h3 
          className="text-2xl md:text-3xl font-black text-black dark:text-white leading-[1.3] mb-5 group-hover:text-red-600 transition-colors line-clamp-2 tracking-tight" 
          style={{ fontFamily: "'Cairo', sans-serif" }} 
          dangerouslySetInnerHTML={{ __html: article.title }} 
        />
        <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
          <span className="text-black dark:text-neutral-200">{article.author}</span>
          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-32 flex justify-center">
          <button 
            disabled={loadingMore}
            onClick={onLoadMore}
            className={`group relative px-16 py-7 bg-black dark:bg-white dark:text-black text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-500 overflow-hidden ${loadingMore ? 'opacity-80 cursor-wait' : ''}`}
          >
            <span className="relative z-10 flex items-center gap-4">
              {loadingMore && <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loadingMore ? 'جاري سحب المزيد...' : 'تحميل الأرشيف'}
            </span>
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
      )}
      
      <div className="mt-24">
        <AdUnit format="auto" />
      </div>
    </section>
  );
};

export default NewsGrid;