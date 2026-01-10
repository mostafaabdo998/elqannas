
import React from 'react';
import { SiteSettings, CategoryItem, PageItem } from '../types';

interface FooterProps {
  settings: SiteSettings | null;
  categories: CategoryItem[];
  pages: PageItem[];
}

const Footer: React.FC<FooterProps> = ({ settings, categories, pages }) => {
  return (
    <footer className="bg-[#050505] text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-red-600/20">
                {settings?.title?.charAt(0) || 'ق'}
              </div>
              <span className="text-2xl font-black tracking-tighter">{settings?.title || 'القناص نيوز'}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8">
              {settings?.description || 'بوابتك الإخبارية الموثوقة لمتابعة الأحداث فور وقوعها بمهنية ومصداقية عالية من قلب الحدث.'}
            </p>
          </div>

          <div>
            <h4 className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8">الأقسام الرئيسية</h4>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
              {categories.slice(0, 10).map(cat => (
                <li key={cat.id}>
                  <button className="text-slate-400 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-wider">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8">عن القناص</h4>
            <ul className="space-y-4">
              {pages.map(page => (
                <li key={page.id}>
                  <button className="text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-wide">
                    {page.title.rendered}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8">المنصات الإجتماعية</h4>
            <div className="flex gap-3 mb-10">
              {['FB', 'TW', 'IG', 'YT', 'TK'].map(social => (
                <div key={social} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer font-black text-[10px] tracking-tighter">
                  {social}
                </div>
              ))}
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">تواصل مباشر</p>
               <p className="text-xs font-black text-red-500">contact@elqannas.net</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">
          <p>© {new Date().getFullYear()} {settings?.title || 'القناص نيوز'} - جميع الحقوق محفوظة</p>
          <div className="mt-4 md:mt-0 flex gap-8">
            <span className="hover:text-red-600 cursor-pointer transition-colors">اتفاقية الاستخدام</span>
            <span className="hover:text-red-600 cursor-pointer transition-colors">سياسة الخصوصية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
