
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import HeroSlider from './components/HeroSlider.tsx';
import NewsGrid from './components/NewsGrid.tsx';
import Footer from './components/Footer.tsx';
import ArticleView from './components/ArticleView.tsx';
import Dashboard from './components/Dashboard.tsx';
import MetaSEO from './components/MetaSEO.tsx';
import { NewsArticle, SiteSettings, CategoryItem, PageItem } from './types.ts';
import { getArticles, getCategories, getSettings } from './lib/api.ts';

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [siteSettings] = useState<SiteSettings>(getSettings());
  const [loading, setLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'dashboard'>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    // محاكاة تحميل البيانات من CMS محلي
    const loadData = () => {
      setArticles(getArticles());
      setCategories(getCategories());
      setLoading(false);
    };
    loadData();
  }, []);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return <Dashboard categories={categories} pages={[]} onExit={handleBackHome} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-midnight transition-colors duration-500">
      {/* محرك SEO التلقائي */}
      <MetaSEO article={selectedArticle || undefined} settings={siteSettings} />

      <Header 
        settings={siteSettings} 
        categories={categories} 
        breakingArticles={articles.slice(0, 5)} 
        onHomeClick={handleBackHome}
        onDashboardOpen={() => setCurrentView('dashboard')}
      />
      
      <main>
        {currentView === 'article' && selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={handleBackHome}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id)}
            trendingArticles={articles} 
          />
        ) : (
          <>
            <HeroSlider articles={articles} onArticleClick={handleArticleClick} />
            <NewsGrid 
              articles={articles} 
              onArticleClick={handleArticleClick}
              hasMore={false}
            />
          </>
        )}
      </main>

      <Footer settings={siteSettings} categories={categories} pages={[]} onDashboardOpen={() => setCurrentView('dashboard')} />
    </div>
  );
};

export default App;
