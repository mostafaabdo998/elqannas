
import React, { useState } from 'react';
import { NewsArticle } from '../types';
import AdUnit from './AdUnit';

interface NewsGridProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({ articles, onArticleClick }) => {
  const [visibleCount, setVisibleCount] = useState(9);
  
  if (articles.length === 0) return (
    <div className="py-32 text-center text-gray-400 font-bold uppercase tracking-widest">
      لا توجد مقالات لعرضها حالياً
    </div>
  );

  // Fix: Explicitly typed ArticleCard as React.FC to resolve the 'key' property error in the map function.
  const ArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div onClick={() => onArticleClick(article)} className="group cursor-pointer">
      <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border border-gray-50 relative">
        <img loading="lazy" src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
        <div className="absolute top-4 right-4">
           <span className="bg-white/90 backdrop-blur-sm text-red-600 font-black text-[9px] px-3 py-1.5 rounded-full shadow-sm">{article.category}</span>
        </div>
      </div>
      <div className="px-2">
        <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 group-hover:text-red-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: article.title }} />
        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
          <span className="text-gray-900">{article.author}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {articles.slice(0, visibleCount).map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {visibleCount < articles.length && (
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="group relative px-10 py-5 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">تحميل المزيد من الأخبار</span>
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      )}
      
      <div className="mt-16">
        <AdUnit format="auto" />
      </div>
    </section>
  );
};

export default NewsGrid;
