'use client';

import React, { useState } from 'react';
import { NewsArticle } from '../types';

interface HeroSliderProps {
  articles: NewsArticle[];
  // Fix: Made onArticleClick optional to resolve error in app/page.tsx
  onArticleClick?: (article: NewsArticle) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ articles, onArticleClick }) => {
  const featured = articles.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (featured.length === 0) return null;
  const active = featured[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div 
          className="lg:w-[72%] relative rounded-[48px] overflow-hidden group cursor-pointer shadow-2xl aspect-video lg:aspect-auto lg:h-[600px] bg-gray-100"
          // Fix: Used optional chaining for onArticleClick
          onClick={() => onArticleClick?.(active)}
        >
          {/* Optimization: High fetch priority for LCP image */}
          <img 
            src={active.imageUrl} 
            // @ts-ignore
            fetchpriority="high"
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

        <div className="lg:w-[28%] flex flex-col gap-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
          {featured.map((article, idx) => (
            <div 
              key={article.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex gap-4 p-4 rounded-[32px] cursor-pointer transition-all duration-300 border-2 ${
                currentIndex === idx 
                ? 'border-red-600 bg-white shadow-xl' 
                : 'border-transparent bg-gray-50/50 hover:bg-white'
              }`}
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gray-200">
                <img src={article.imageUrl} loading="lazy" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight" dangerouslySetInnerHTML={{ __html: article.title }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;