
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.tsx';
import HeroSlider from './components/HeroSlider.tsx';
import NewsGrid from './components/NewsGrid.tsx';
import Footer from './components/Footer.tsx';
import ArticleView from './components/ArticleView.tsx';
import { NewsArticle, SiteSettings, CategoryItem, PageItem } from './types.ts';

const WP_API_ROOT = 'https://www.elqannas.net/wp-json/wp/v2';
const credentials = btoa('mostafaabdo99:0Gl9 aTQY dokO Ut2Y JXAG QZ3d');

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category'>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const formatArabicDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  const mapWPPost = useCallback((post: any): NewsArticle => ({
    id: post.id.toString(),
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'عام',
    author: post._embedded?.['author']?.[0]?.name || 'القناص',
    date: formatArabicDate(post.date),
    imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/800/450`,
    slug: post.slug,
  }), []);

  const fetchData = useCallback(async (pageNum = 1, catId: number | null = null, isMore = false) => {
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const headers = { 'Authorization': `Basic ${credentials}` };
      let url = `${WP_API_ROOT}/posts?_embed&per_page=12&page=${pageNum}`;
      if (catId) url += `&categories=${catId}`;

      const response = await fetch(url, { headers });
      
      if (pageNum === 1 && !isMore) {
        const [catsRes, pagesRes] = await Promise.all([
          fetch(`${WP_API_ROOT}/categories?per_page=100&hide_empty=true`),
          fetch(`${WP_API_ROOT}/pages?per_page=10`)
        ]);
        if (catsRes.ok) setCategories(await catsRes.json());
        if (pagesRes.ok) setPages(await pagesRes.json());
        setSiteSettings({ title: 'القناص نيوز', description: 'بوابة الخبر والتحليل' });
      }

      if (response.ok) {
        const posts = await response.json();
        const mapped = posts.map(mapWPPost);
        if (isMore) setArticles(prev => [...prev, ...mapped]);
        else setArticles(mapped);
        setHasMore(posts.length === 12);
      }
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [mapWPPost]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleCategoryClick = (cat: CategoryItem) => {
    setActiveCategoryId(cat.id);
    setPage(1);
    setCurrentView('category');
    fetchData(1, cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    setActiveCategoryId(null);
    setPage(1);
    fetchData(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-400">تحميل القناص...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-midnight transition-colors duration-500">
      <Header 
        settings={siteSettings} 
        categories={categories} 
        breakingArticles={articles.slice(0, 5)} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onCategoryClick={handleCategoryClick}
        onHomeClick={handleBackHome}
      />
      
      <main className="animate-slide">
        {currentView === 'article' && selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={handleBackHome}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id)}
            trendingArticles={articles.slice().reverse().slice(0, 6)} // تجريبي للأكثر قراءة
          />
        ) : (
          <>
            <HeroSlider 
              articles={articles} 
              onArticleClick={handleArticleClick} 
            />
            
            {currentView === 'category' && (
              <div className="container mx-auto px-6 mt-16">
                <h2 className="text-3xl font-black text-red-600 border-r-4 border-red-600 pr-4">
                  قسم: {categories.find(c => c.id === activeCategoryId)?.name}
                </h2>
              </div>
            )}

            <NewsGrid 
              articles={articles} 
              onArticleClick={handleArticleClick}
              onLoadMore={() => {
                const next = page + 1;
                setPage(next);
                fetchData(next, activeCategoryId, true);
              }}
              hasMore={hasMore}
              loadingMore={loadingMore}
            />
          </>
        )}
      </main>

      <Footer settings={siteSettings} categories={categories} pages={pages} />
    </div>
  );
};

export default App;
