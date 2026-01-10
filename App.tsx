
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
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
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

  const mapWPPost = useCallback((post: any): NewsArticle => ({
    id: post.id.toString(),
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'عام',
    author: post._embedded?.['author']?.[0]?.name || 'القناص',
    date: new Date(post.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }),
    imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/800/450`,
    slug: post.slug,
  }), []);

  const fetchData = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const headers = { 'Authorization': `Basic ${credentials}` };
      const response = await fetch(`${WP_API_ROOT}/posts?_embed&per_page=12&page=${pageNum}`, { headers });
      
      if (pageNum === 1) {
        const [settingsRes, catsRes, pagesRes] = await Promise.all([
          fetch(`${WP_API_ROOT}/settings`, { headers }).catch(() => null),
          fetch(`${WP_API_ROOT}/categories?per_page=100&hide_empty=true`),
          fetch(`${WP_API_ROOT}/pages?per_page=10`)
        ]);
        if (settingsRes?.ok) setSiteSettings(await settingsRes.json());
        if (catsRes?.ok) setCategories(await catsRes.json());
        if (pagesRes?.ok) setPages(await pagesRes.json());
      }

      if (response.ok) {
        const posts = await response.json();
        const mappedPosts = posts.map(mapWPPost);
        if (isLoadMore) setArticles(prev => [...prev, ...mappedPosts]);
        else setArticles(mappedPosts);
        setHasMore(posts.length === 12);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    setLoadingMore(false);
  }, [mapWPPost]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchData(next, true);
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-midnight flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-500 min-h-screen dark:bg-midnight">
      <Header 
        settings={siteSettings} 
        categories={categories} 
        breakingArticles={articles.slice(0, 5)} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main>
        {selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id).slice(0, 5)}
          />
        ) : (
          <div className="fade-up">
            <HeroSlider 
              articles={articles} 
              onArticleClick={setSelectedArticle} 
            />
            <NewsGrid 
              articles={articles} 
              onArticleClick={setSelectedArticle}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadingMore={loadingMore}
            />
          </div>
        )}
      </main>

      <Footer settings={siteSettings} categories={categories} pages={pages} />
    </div>
  );
};

export default App;
