
import React from 'react';
import { NewsArticle } from '../types';
import AdUnit from './AdUnit';

interface ArticleViewProps {
  article: NewsArticle;
  onBack: () => void;
  relatedArticles: NewsArticle[];
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, relatedArticles }) => {
  return (
    <article className="bg-white min-h-screen animate-in fade-in duration-700">
      <div className="bg-gray-50/50 border-b border-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="mb-8 flex items-center justify-center text-[10px] font-black text-gray-400 gap-4 uppercase tracking-[0.3em]">
            <button onClick={onBack} className="hover:text-red-600 transition-colors underline decoration-red-600/30 underline-offset-4">الرئيسية</button>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span className="text-red-600">{article.category}</span>
          </nav>

          <h1 
            className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-12 tracking-tighter text-center"
            dangerouslySetInnerHTML={{ __html: article.title }}
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-4 bg-white px-5 py-2 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-red-100 overflow-hidden">
                <img loading="lazy" src={`https://i.pravatar.cc/100?u=${article.author}`} alt={article.author} className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-gray-900">{article.author}</div>
                <div className="text-[10px] text-red-600 font-bold uppercase">التحرير</div>
              </div>
            </div>
            <div className="text-[11px] font-bold text-gray-400 flex gap-4 uppercase">
              <span>{article.date}</span>
              <span>•</span>
              <span className="text-red-600">قراءة في 5 دقائق</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-10 md:-mt-12 mb-16">
        <div className="aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
          <img src={article.imageUrl} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl pb-20">
        <div className="prose prose-xl prose-slate max-w-none">
          <div 
            className="text-2xl text-gray-700 leading-relaxed font-black mb-12 pr-6 border-r-4 border-red-600 italic"
            dangerouslySetInnerHTML={{ __html: article.excerpt }}
          />
          <div 
            className="article-body text-xl text-gray-800 leading-[1.9] space-y-8 font-medium text-justify"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <AdUnit className="mt-20" />

        {/* مقالات ذات صلة */}
        {relatedArticles.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              أخبار ذات صلة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(rel => (
                <div key={rel.id} className="group cursor-pointer" onClick={() => window.location.hash = `/${rel.slug}/${rel.id}`}>
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-md">
                    <img src={rel.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                  </div>
                  <h4 className="font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: rel.title }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .article-body p { margin-bottom: 2rem; }
        .article-body h2 { font-size: 2rem; font-weight: 900; color: #111827; margin-top: 3rem; margin-bottom: 1.5rem; }
        .article-body blockquote { border-right: 4px solid #e11d48; padding-right: 1.5rem; margin: 2rem 0; font-style: italic; color: #4b5563; }
      `}</style>
    </article>
  );
};

export default ArticleView;
