'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsArticle } from '../types';
import AdUnit from './AdUnit';

interface ArticleViewProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  // Fix: Added missing onBack prop to resolve App.tsx error
  onBack?: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, relatedArticles, onBack }) => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) setReadingProgress((currentScroll / scrollHeight) * 100);
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <article className="bg-white min-h-screen">
      <div className="fixed top-0 left-0 w-full h-2 z-[120] bg-gray-50">
        <div className="h-full bg-red-600 shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all duration-150" style={{ width: `${readingProgress}%` }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-20">
        {/* Fix: Display back button if onBack is provided */}
        {onBack && (
          <button onClick={onBack} className="mb-8 text-sm font-bold text-red-600 flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
            <span>←</span> العودة
          </button>
        )}
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[68%]">
            <nav className="mb-10 flex items-center gap-3">
              <Link href="/" className="text-[11px] font-black text-gray-400 hover:text-black uppercase tracking-widest">الرئيسية</Link>
              <span className="text-gray-200">/</span>
              <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">{article.category}</span>
            </nav>

            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black text-black leading-[1.1] mb-12 tracking-tighter"
              style={{ fontFamily: "'Cairo', sans-serif" }}
              dangerouslySetInnerHTML={{ __html: article.title }}
            />

            <div className="flex items-center gap-6 mb-16 pb-10 border-b border-gray-100">
              <div className="w-16 h-16 rounded-[2rem] bg-black text-white flex items-center justify-center font-black text-2xl">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-black text-black">{article.author}</div>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{article.date}</div>
              </div>
            </div>

            <div className="rounded-[4rem] overflow-hidden shadow-2xl mb-16 aspect-video border border-gray-50">
              <img src={article.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="prose prose-2xl max-w-none">
              <div 
                className="text-2xl md:text-3xl text-black leading-relaxed font-black mb-16 p-10 bg-gray-50 rounded-[3rem] border-r-[12px] border-red-600"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
              <div 
                className="article-body-text"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          <aside className="lg:w-[32%]">
            <div className="sticky top-28 space-y-12">
              <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-50">
                <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-4">
                  <span className="w-3 h-10 bg-red-600 rounded-full"></span>
                  الأكثر رواجاً
                </h3>
                <div className="space-y-10">
                  {relatedArticles.slice(0, 6).map((rel, i) => (
                    <Link 
                      key={rel.id} 
                      href={`/${rel.slug}/${rel.id}`}
                      className="group flex gap-5 items-start"
                    >
                      <span className="text-4xl font-black text-gray-100 group-hover:text-red-600/20 transition-colors">0{i+1}</span>
                      <h4 className="text-base font-black text-black group-hover:text-red-600 leading-tight transition-colors" dangerouslySetInnerHTML={{ __html: rel.title }} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Discovery Feed Section remains with Link updates */}
      <style>{`
        .article-body-text p { margin-bottom: 3rem; font-size: 1.45rem; line-height: 2.4; color: #000; text-align: justify; font-family: 'Almarai', sans-serif; }
        .article-body-text h2 { font-size: 2.8rem; font-weight: 900; color: #000; margin: 5rem 0 2.5rem 0; font-family: 'Cairo', sans-serif; border-right: 12px solid #e11d48; padding-right: 2rem; }
        .article-body-text img { border-radius: 4rem; margin: 4rem 0; box-shadow: 0 40px 80px rgba(0,0,0,0.1); width: 100%; }
      `}</style>
    </article>
  );
};

export default ArticleView;