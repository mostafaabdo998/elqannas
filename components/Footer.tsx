
import React from 'react';
import { SiteSettings, CategoryItem, PageItem } from '../types';

interface FooterProps {
  settings: SiteSettings | null;
  categories: CategoryItem[];
  pages: PageItem[];
}

const Footer: React.FC<FooterProps> = ({ settings, categories, pages }) => {
  return (
    <footer className="bg-neutral-950 text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl">
                {settings?.title?.charAt(0) || 'ق'}
              </div>
              <span className="text-2xl font-black tracking-tighter">{settings?.title || 'القناص'}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium mb-8">
              {settings?.description || 'بوابتك الإخبارية الموثوقة لمتابعة الأحداث فور وقوعها بمهنية ومصداقية.'}
            </p>
          </div>

          {/* Real Categories */}
          <div>
            <h4 className="text-red-600 font-black text-sm uppercase tracking-widest mb-8">الأقسام</h4>
            <ul className="grid grid-cols-2 gap-4">
              {categories.slice(0, 8).map(cat => (
                <li key={cat.id}>
                  <a href={`#category/${cat.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Real Pages from WP */}
          <div>
            <h4 className="text-red-600 font-black text-sm uppercase tracking-widest mb-8">روابط تهمك</h4>
            <ul className="space-y-4">
              {pages.map(page => (
                <li key={page.id}>
                  <a href={`#page/${page.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">
                    {page.title.rendered}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-red-600 font-black text-sm uppercase tracking-widest mb-8">تابعنا</h4>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'YT'].map(social => (
                <div key={social} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer font-black text-[10px]">
                  {social}
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
               <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Email us</p>
               <p className="text-sm font-black">contact@elqannas.net</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} {settings?.title || 'القناص نيوز'} - جميع الحقوق محفوظة</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <span className="hover:text-red-600 cursor-pointer transition-colors">Headless CMS Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
