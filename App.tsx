
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [fetchingArticle, setFetchingArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const articlesRef = useRef<NewsArticle[]>([]);

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
    seo: {
      rank_math_title: post.rank_math_title,
      rank_math_description: post.rank_math_description
    }
  }), []);

  // Fix: Wrapped fetchData in useCallback to ensure stable reference for useEffect and handleLoadMore
  const fetchData = useCallback(async (pageNum = 1, isLoadMore = false, catId: number | null = null) => {
    if (isLoadMore) setLoadingMore(true);
    else {
      setLoading(true);
      if (!isLoadMore) {
        setArticles([]); // تصفير المقالات عند تغيير القسم
        window.scrollTo(0, 0);
      }
    }

    try {
      const headers = { 'Authorization': `Basic ${credentials}` };
      let postsUrl = `${WP_API_ROOT}/posts?_embed&per_page=12&page=${pageNum}`;
      if (catId) postsUrl += `&categories=${catId}`;
      
      const response = await fetch(postsUrl, { headers });
      
      if (pageNum === 1 && !isLoadMore) {
        // جلب الإعدادات والأقسام فقط في المرة الأولى
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
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [mapWPPost]);

  // Fix: Implemented handleLoadMore to fix the "Cannot find name 'handleLoadMore'" error
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true, currentCategoryId);
  }, [page, loadingMore, hasMore, currentCategoryId, fetchData]);

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash || '#/';
      if (hash === '#/') {
        setSelectedArticle(null);
        if (currentCategoryId !== null) {
          setCurrentCategoryId(null);
          setPage(1);
          fetchData(1, false, null);
        } else if (articles.length === 0) {
          fetchData(1);
        }
      } else if (hash.startsWith('#category/')) {
        const slug = hash.replace('#category/', '');
        const foundCat = categories.find(c => c.slug === slug);
        if (foundCat && foundCat.id !== currentCategoryId) {
          setCurrentCategoryId(foundCat.id);
          setPage(1);
          fetchData(1, false, foundCat.id);
          setSelectedArticle(null);
        }
      } else if (hash.includes('/')) {
        const parts = hash.split('/');
        const idOrSlug = parts[parts.length - 1];
        // محاولة إيجاد المقال محلياً أولاً لتسريع العرض
        const local = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
        if (local) {
          setSelectedArticle(local);
        } else {
          setFetchingArticle(true);
          fetch(`${WP_API_ROOT}/posts/${idOrSlug}?_embed`)
            .then(res => res.ok ? res.json() : fetch(`${WP_API_ROOT}/posts?slug=${idOrSlug}&_embed`).then(r => r.json()))
            .then(data => {
              const post = Array.isArray(data) ? data[0] : data;
              if (post) setSelectedArticle(mapWPPost(post));
            })
            .catch(err => console.error(err))
            .finally(() => setFetchingArticle(false));
        }
      }
    };
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, [categories, currentCategoryId, articles, fetchData, mapWPPost]);

  const handleSearch = useCallback((query: string) => {
    if (!query) return;
    setLoading(true);
    fetch(`${WP_API_ROOT}/posts?_embed&search=${query}&per_page=12`)
      .then(res => res.json())
      .then(posts => {
        setArticles(posts.map(mapWPPost));
        setSelectedArticle(null);
        setLoading(false);
        setHasMore(false);
      });
  }, [mapWPPost]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-white text-black'}`}>
      <Header 
        settings={siteSettings} 
        categories={categories} 
        breakingArticles={articles.slice(0, 5)} 
        onSearch={handleSearch}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex-grow">
        {(loading || fetchingArticle) && !selectedArticle ? (
          <SkeletonHome />
        ) : selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => window.location.hash = '/'} 
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id).slice(0, 10)}
          />
        ) : (
          <div className="animate-in fade-in duration-700">
            {!currentCategoryId && <HeroSlider articles={articles} onArticleClick={(a) => window.location.hash = `/${a.slug}/${a.id}`} />}
            {currentCategoryId && (
              <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-5xl md:text-7xl font-black text-black mb-4 tracking-tighter">
                  {categories.find(c => c.id === currentCategoryId)?.name}
                </h2>
                <div className="w-24 h-2 bg-red-600 mx-auto rounded-full shadow-lg shadow-red-600/20"></div>
              </div>
            )}
            <NewsGrid 
              articles={articles} 
              onArticleClick={(a) => window.location.hash = `/${a.slug}/${a.id}`} 
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

const SkeletonHome = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="w-full h-[500px] bg-gray-50 dark:bg-neutral-900 animate-pulse rounded-[60px] mb-16"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="space-y-6">
          <div className="aspect-[4/3] bg-gray-50 dark:bg-neutral-900 animate-pulse rounded-[40px]"></div>
          <div className="h-8 bg-gray-50 dark:bg-neutral-900 animate-pulse w-3/4 rounded-lg"></div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
