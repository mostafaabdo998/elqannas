
import React, { useState } from 'react';
import { NewsArticle } from '../types';

interface HeroSliderProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ articles, onArticleClick }) => {
  const featured = articles.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (featured.length === 0) return null;
  const active = featured[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* العرض الرئيسي */}
        <div 
          className="lg:w-[72%] relative rounded-[48px] overflow-hidden group cursor-pointer shadow-2xl aspect-video lg:aspect-auto lg:h-[600px]"
          onClick={() => onArticleClick(active)}
        >
          <img 
            src={active.imageUrl} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
            alt={active.title.replace(/<\/?[^>]+(>|$)/g, "")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 right-0 p-8 md:p-14 w-full">
            <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase mb-6 inline-block tracking-widest shadow-xl">
              {active.category}
            </span>
            <h2 
              className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-8 max-w-4xl tracking-tighter"
              dangerouslySetInnerHTML={{ __html: active.title }}
            />
            <div className="flex items-center gap-6 text-gray-300 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-600/30"></div>
                <span>{active.author}</span>
              </div>
              <span className="opacity-30">/</span>
              <span>{active.date}</span>
            </div>
          </div>
        </div>

        {/* القائمة الجانبية التفاعلية */}
        <div className="lg:w-[28%] flex flex-col gap-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
          <div className="mb-2 px-2">
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">أبرز العناوين</span>
          </div>
          {featured.map((article, idx) => (
            <div 
              key={article.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex gap-4 p-4 rounded-[32px] cursor-pointer transition-all duration-300 border-2 ${
                currentIndex === idx 
                ? 'border-red-600 bg-white shadow-2xl -translate-x-2' 
                : 'border-transparent bg-gray-50/50 hover:bg-white hover:shadow-lg'
              }`}
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                <img src={article.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[9px] font-black text-red-600 mb-2 uppercase tracking-tighter">{article.category}</span>
                <h3 
                  className="text-sm font-black text-gray-900 line-clamp-2 leading-tight"
                  dangerouslySetInnerHTML={{ __html: article.title }}
                />
              </div>
            </div>
          ))}
          
          <div className="mt-auto p-8 bg-neutral-900 rounded-[40px] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
            <div className="relative z-10">
               <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Exclusive</div>
               <div className="text-xl font-black leading-none mb-4">اشترك في النشرة البريدية</div>
               <button className="w-full py-3 bg-white text-black font-black text-[10px] uppercase rounded-2xl hover:bg-red-600 hover:text-white transition-all">Join Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
