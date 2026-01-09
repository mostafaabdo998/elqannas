
import React from 'react';
import { NewsArticle } from '../types';

interface BreakingNewsProps {
  articles: NewsArticle[];
}

const BreakingNews: React.FC<BreakingNewsProps> = ({ articles }) => {
  const titles = articles.length > 0 
    ? articles.map(a => a.title.replace(/<\/?[^>]+(>|$)/g, "")) 
    : ["جاري تحميل آخر الأخبار عاجل...", "القناص نيوز: تغطية مستمرة على مدار الساعة"];

  return (
    <div className="bg-[#0f0f0f] text-white h-12 flex items-center overflow-hidden">
      <div className="bg-red-600 text-white px-6 h-full flex items-center font-black text-xs md:text-sm z-10 shrink-0 whitespace-nowrap shadow-[10px_0_20px_rgba(0,0,0,0.3)] italic">
        <span className="animate-pulse ml-2 flex h-2 w-2 rounded-full bg-white"></span>
        عاجل
      </div>
      <div className="relative flex-1 bg-[#0f0f0f]">
        <div className="animate-marquee whitespace-nowrap py-2 text-sm font-bold tracking-tight">
          {titles.map((text, idx) => (
            <span key={idx} className="mx-12 cursor-default hover:text-red-500 transition-colors">
              {text} <span className="text-red-600 mx-4 opacity-50">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
