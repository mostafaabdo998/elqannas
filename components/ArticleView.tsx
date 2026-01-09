
import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../types';
import AdUnit from './AdUnit.tsx';

interface ArticleViewProps {
  article: NewsArticle;
  onBack: () => void;
  relatedArticles: NewsArticle[];
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, relatedArticles }) => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress((currentScroll / scrollHeight) * 100);
      }
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, [article.id]);

  const renderContentWithSuggestions = () => {
    const paragraphs = article.content.split('</p>');
    if (paragraphs.length < 4 || relatedArticles.length === 0) {
      return <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />;
    }

    const midPoint = Math.floor(paragraphs.length / 2);
    const firstHalf = paragraphs.slice(0, midPoint).join('</p>') + '</p>';
    const secondHalf = paragraphs.slice(midPoint).join('</p>');
    const suggestedArticle = relatedArticles[0];

    return (
      <div className="article-content">
        <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
        
        {/* صندوق الاقتراح الذكي */}
        <div className="my-12 p-6 md:p-8 bg-gray-50 border-r-4 border-red-600 rounded-3xl shadow-sm group cursor-pointer transition-all hover:bg-white hover:shadow-xl border border-gray-100"
             onClick={() => window.location.hash = `/${suggestedArticle.slug}/${suggestedArticle.id}`}>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-40 h-28 shrink-0 rounded-2xl overflow-hidden shadow-md">
              <img src={suggestedArticle.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 block">الزوار يقرأون أيضاً</span>
              <h4 className="text-xl font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors" 
                  dangerouslySetInnerHTML={{ __html: suggestedArticle.title }} />
            </div>
          </div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
      </div>
    );
  };

  return (
    <article className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* شريط التقدم */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[60] bg-gray-100">
        <div className="h-full bg-red-600 transition-all duration-150 shadow-[0_0_10px_#e11d48]" style={{ width: `${readingProgress}%` }}></div>
      </div>

      <div className="relative pt-12 pb-12">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <nav className="mb-8 flex items-center justify-center gap-3">
            <button onClick={onBack} className="text-[10px] font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest">الرئيسية</button>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600/20"></span>
            <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{article.category}</span>
          </nav>

          {/* العنوان بحجم متوسط ومناسب بناء على طلبك */}
          <h1 
            className="text-2xl md:text-4xl lg:text-5xl font-[900] text-gray-900 leading-[1.3] mb-10 tracking-tight text-center lg:px-6"
            style={{ fontFamily: "'Cairo', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: article.title }}
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-black text-gray-900">{article.author}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{article.date}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mb-16">
        <div className="aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
          <img src={article.imageUrl} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl pb-24">
        <div className="prose prose-xl prose-slate max-w-none">
          <div 
            className="text-xl md:text-2xl text-gray-700 leading-relaxed font-[700] mb-12 pr-6 border-r-4 border-red-600 bg-gray-50/50 py-5 rounded-l-2xl shadow-sm"
            dangerouslySetInnerHTML={{ __html: article.excerpt }}
          />
          <div className="article-body-text">
            {renderContentWithSuggestions()}
          </div>
        </div>

        <AdUnit className="mt-20" />

        <div className="mt-16 py-8 border-y border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مشاركة:</span>
              <div className="flex gap-2">
                 {[1,2,3].map(i => (
                   <button key={i} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"/></svg>
                   </button>
                 ))}
              </div>
           </div>
           <button onClick={onBack} className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg">العودة للرئيسية</button>
        </div>
      </div>

      <style>{`
        .article-body-text p { margin-bottom: 2.2rem; font-size: 1.25rem; line-height: 2.1; color: #374151; text-align: justify; }
        .article-body-text h2 { font-size: 2rem; font-weight: 900; color: #111827; margin: 3.5rem 0 1.5rem 0; letter-spacing: -0.01em; }
        @media (max-width: 768px) {
          .article-body-text p { font-size: 1.15rem; line-height: 1.9; }
        }
      `}</style>
    </article>
  );
};

export default ArticleView;
