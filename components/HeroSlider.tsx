
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
    <section className="relative w-full h-[70vh] md:h-[85vh] mt-24 px-4 md:px-10">
      <div 
        className="w-full h-full relative rounded-[3rem] md:rounded-[5xl] overflow-hidden group cursor-pointer shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
        onClick={() => onArticleClick?.(active)}
      >
        {/* Main Background Image */}
        <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-[4s] ease-out">
          <img 
            src={active.imageUrl} 
            className="w-full h-full object-cover" 
            alt={active.title}
          />
        </div>

        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/60 via-transparent to-transparent hidden md:block"></div>

        {/* Content Box */}
        <div className="absolute bottom-0 right-0 w-full p-8 md:p-20 text-right">
          <div className="inline-flex items-center gap-3 bg-red-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-bounce">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            خبر مميز
          </div>
          
          <h2 
            className="text-white text-4xl md:text-7xl lg:text-8xl font-black leading-[1] mb-10 max-w-5xl tracking-tighter drop-shadow-2xl fade-up"
            style={{ fontFamily: "'Cairo', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: active.title }}
          />

          <div className="flex flex-wrap items-center gap-8 text-gray-300 text-xs font-black uppercase tracking-widest">
             <div className="flex items-center gap-3">
                <span className="text-red-500">القسم:</span>
                <span className="text-white">{active.category}</span>
             </div>
             <div className="hidden md:flex items-center gap-3">
                <span className="text-red-500">بواسطة:</span>
                <span className="text-white">{active.author}</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-red-500">التاريخ:</span>
                <span className="text-white">{active.date}</span>
             </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
          {featured.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`w-3 transition-all duration-500 rounded-full ${currentIndex === idx ? 'h-16 bg-red-600 shadow-[0_0_20px_#e11d48]' : 'h-3 bg-white/20 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
