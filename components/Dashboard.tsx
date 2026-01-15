
'use client';

import React, { useState } from 'react';
import { CategoryItem, PageItem, NewsArticle } from '../types.ts';

interface DashboardProps {
  categories: CategoryItem[];
  pages: PageItem[];
  onExit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ categories, pages, onExit }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#f0f0f1] overflow-hidden font-sans text-right" dir="rtl">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-[#2c3338] transition-all duration-200 flex flex-col`}>
        <div className="p-4 bg-[#1d2327] flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">ق</div>
          {isSidebarOpen && <span className="font-bold">لوحة التحكم</span>}
        </div>
        <nav className="flex-1 mt-4">
          {[
            { id: 'overview', label: 'الرئيسية', icon: '🏠' },
            { id: 'posts', label: 'المقالات', icon: '📌' },
            { id: 'new-post', label: 'أضف جديداً', icon: '➕' },
            { id: 'seo', label: 'تحسين السيو', icon: '📈' },
            { id: 'settings', label: 'الإعدادات', icon: '⚙️' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:bg-[#1d2327] hover:text-blue-400 transition-all ${activeTab === item.id ? 'bg-blue-600 text-white' : ''}`}
            >
              <span>{item.icon}</span>
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={onExit} className="p-4 text-slate-400 hover:text-white border-t border-slate-700 flex items-center gap-4">
          <span>🚪</span>
          {isSidebarOpen && <span className="text-sm">زيارة الموقع</span>}
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-[#f0f0f1] p-8">
        {activeTab === 'new-post' ? (
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-8">إضافة مقال جديد</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Editor Column */}
              <div className="lg:col-span-2 space-y-6">
                <input placeholder="أدخل العنوان هنا" className="w-full p-4 text-xl border border-slate-300 outline-none focus:border-blue-500 bg-white" />
                <div className="bg-white border border-slate-300 p-4 min-h-[400px]">
                  <p className="text-slate-400 italic">ابدأ الكتابة هنا... (محرر Gutenberg)</p>
                </div>
                
                {/* SEO Rank Math Meta Box */}
                <div className="bg-white border border-slate-300 rounded shadow-sm">
                  <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                    <span className="font-bold flex items-center gap-2">📈 إعدادات Rank Math SEO</span>
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">85 / 100</span>
                  </div>
                  <div className="p-6 space-y-6">
                     <div>
                       <label className="block text-xs font-bold mb-2">معاينة جوجل (Snippet)</label>
                       <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-300 font-sans" dir="ltr">
                         <div className="text-blue-700 text-lg hover:underline cursor-pointer">عنوان المقال سيظهر هنا بشكل جذاب...</div>
                         <div className="text-green-700 text-sm">https://elqannas.net › article-slug</div>
                         <div className="text-slate-600 text-sm">هذا هو وصف الميتا التلقائي الذي سيظهر في نتائج البحث لجذب الزوار...</div>
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold mb-2">الكلمة المفتاحية (Focus Keyword)</label>
                       <input className="w-full p-2 border border-slate-300 text-sm" placeholder="مثال: تردد قناة وناسة" />
                     </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-300 p-6 shadow-sm">
                  <h3 className="font-bold border-b pb-2 mb-4">نشر</h3>
                  <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-all">نشر المقال</button>
                  <button className="w-full mt-2 text-blue-600 text-sm hover:underline">حفظ كمسودة</button>
                </div>
                <div className="bg-white border border-slate-300 p-6 shadow-sm">
                  <h3 className="font-bold border-b pb-2 mb-4">الصورة البارزة</h3>
                  <div className="aspect-video bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-all">
                    تعيين صورة للمقال
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">يفضل مقاس 1200x675 لظهور أفضل في Discover</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <span className="text-6xl mb-4">📊</span>
             <h2 className="text-xl font-bold text-slate-600">نظرة عامة على نشاط الموقع</h2>
             <p>اختر من القائمة الجانبية للبدء في الإدارة</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
