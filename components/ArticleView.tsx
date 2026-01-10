
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsArticle } from '../types';

interface ArticleViewProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
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
    <article className="bg-white dark:bg-midnight min-h-screen transition-colors duration-500">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[150] bg-transparent">
        <div 
          className="h-full bg-brand-red shadow-[0_0_15px_#E11D48] transition-all duration-200" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl pt-32 pb-24">
        {onBack && (
          <button 
            onClick={onBack} 
            className="mb-12 group flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-brand-red transition-all"
          >
            <span className="w-10 h-10 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:border-brand-red group-hover:bg-brand-red group-hover:text-white transition-all">→</span>
            العودة للرئيسية
          </button>
        )}

        <header className="mb-16">
          <Link href={`/category/${article.slug}`} className="inline-block bg-brand-red/10 text-brand-red px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            {article.category}
          </Link>
          
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-12 tracking-tight"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: article.title }}
          />

          <div className="flex items-center gap-8 py-8 border-y border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
                 {article.author.charAt(0)}
               </div>
               <div>
                 <div className="text-base font-bold text-slate-900 dark:text-white">{article.author}</div>
                 <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">{article.date}</div>
               </div>
            </div>
            <div className="mr-auto flex gap-3">
              <button className="w-10 h-10 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-2/3">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-16 aspect-video bg-slate-100 dark:bg-white/5">
              <img src={article.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none article-content">
              {/* ملخص المقال */}
              <div 
                className="text-2xl md:text-3xl text-slate-800 dark:text-slate-200 leading-[1.6] font-bold mb-16 italic border-r-8 border-brand-red pr-10"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
              
              {/* محتوى المقال مع التنسيق المطور */}
              <div 
                className="article-body-rich"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-12">
              <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
                  اكتشافات ذات صلة
                </h3>
                <div className="space-y-8">
                  {relatedArticles.map((rel) => (
                    <Link 
                      key={rel.id} 
                      href={`/${rel.slug}/${rel.id}`}
                      className="group flex gap-5 items-center"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img src={rel.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-red leading-tight transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: rel.title }} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <style>{`
        .article-body-rich {
          font-size: 1.25rem;
          line-height: 2.1;
          color: #334155;
        }
        .dark .article-body-rich {
          color: #CBD5E1;
        }
        .article-body-rich p {
          margin-bottom: 2.5rem;
          text-align: justify;
        }
        
        /* تصميم العنوان الفرعي الرئيسي h2 */
        .article-body-rich h2 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: #0F172A;
          margin: 4.5rem 0 2rem 0;
          padding: 1.5rem 2rem;
          background: #F8FAFC;
          border-right: 12px solid #E11D48;
          border-radius: 0 1rem 1rem 0;
          line-height: 1.3;
        }
        .dark .article-body-rich h2 {
          color: #FFFFFF;
          background: rgba(255,255,255,0.03);
        }

        /* تصميم العنوان الثانوي h3 */
        .article-body-rich h3 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #E11D48;
          margin: 3.5rem 0 1.5rem 0;
          display: inline-block;
          border-bottom: 4px solid #E11D48;
          padding-bottom: 0.5rem;
          line-height: 1.4;
        }
        .dark .article-body-rich h3 {
          color: #FB7185;
          border-bottom-color: #FB7185;
        }

        .article-body-rich img {
          border-radius: 2.5rem;
          margin: 4rem 0;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
        }
        .article-body-rich ul, .article-body-rich ol {
          margin: 2rem 0;
          padding-right: 2rem;
        }
        .article-body-rich li {
          margin-bottom: 1rem;
          position: relative;
        }
        .article-body-rich li::before {
          content: "";
          position: absolute;
          right: -1.5rem;
          top: 0.8rem;
          width: 8px;
          height: 8px;
          background: #E11D48;
          border-radius: 50%;
        }
      `}</style>
    </article>
  );
};

export default ArticleView;
