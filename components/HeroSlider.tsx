
'use client';

import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';

interface HeroSliderProps {
  articles: NewsArticle[];
  onArticleClick?: (article: NewsArticle) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ articles, onArticleClick }) => {
  const featured = articles.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const active = featured[currentIndex];

  return (
    <section className="relative w-full h-[65vh] md:h-[75vh] mt-24 px-4 md:px-10">
      <div 
        className="w-full h-full relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl"
        onClick={() => onArticleClick?.(active)}
      >
        <div className="absolute inset-0 transition-transform duration-[5s] group-hover:scale-105">
          <img src={active.imageUrl} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent"></div>

        <div className="absolute bottom-0 right-0 w-full p-8 md:p-16 text-right">
          <span className="inline-block bg-red-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase mb-5">خبر مميز</span>
          
          <h2 
            className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-[1.3] mb-8 max-w-4xl tracking-tight"
            dangerouslySetInnerHTML={{ __html: active.title }}
          />

          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
             <span className="text-white">{active.category}</span>
             <span className="w-1 h-1 bg-red-600 rounded-full"></span>
             <span>{active.author}</span>
             <span className="w-1 h-1 bg-white/20 rounded-full"></span>
             <span>{active.date}</span>
          </div>
        </div>

        <div className="absolute left-8 bottom-8 flex gap-2">
          {featured.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
