
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
      className="group cursor-pointer flex flex-col h-full bg-white dark:bg-midnight rounded-[2.5rem] p-4 news-card-shadow transition-all duration-500 border border-transparent hover:border-slate-100 dark:hover:border-white/5"
    >
      <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 relative bg-slate-100 dark:bg-white/5">
        <img 
          loading="lazy" 
          src={article.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
          alt={article.title} 
        />
        <div className="absolute top-5 right-5">
           <span className="bg-white/90 dark:bg-midnight/90 backdrop-blur-md text-brand-red font-black text-[9px] px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">{article.category}</span>
        </div>
      </div>
      
      <div className="px-3 flex-1 flex flex-col">
        <h3 
          className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-[1.3] mb-6 group-hover:text-brand-red transition-colors line-clamp-3 tracking-tight" 
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          dangerouslySetInnerHTML={{ __html: article.title }} 
        />
        
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 dark:border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.author}</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{article.date}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="flex flex-col mb-16 gap-4">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            أحدث <span className="text-brand-red">التغطيات</span>
          </h2>
          <div className="w-20 h-1.5 bg-brand-red rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-24 flex justify-center">
          <button 
            disabled={loadingMore}
            onClick={onLoadMore}
            className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-red dark:hover:bg-brand-red dark:hover:text-white transition-all shadow-xl active:scale-95"
          >
            {loadingMore ? 'جاري التحميل...' : 'اكتشف المزيد'}
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsGrid;
