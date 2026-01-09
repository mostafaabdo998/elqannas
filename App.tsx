
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header.tsx';
import HeroSlider from './components/HeroSlider.tsx';
import NewsGrid from './components/NewsGrid.tsx';
import Footer from './components/Footer.tsx';
import ArticleView from './components/ArticleView.tsx';
import { NewsArticle, SiteSettings, CategoryItem, PageItem } from './types.ts';

const WP_API_ROOT = 'https://www.elqannas.net/wp-json/wp/v2';
const credentials = btoa('mostafaabdo99:0Gl9 aTQY dokO Ut2Y JXAG QZ3d');
const CACHE_KEY = 'elqannas_cache_v1';

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingArticle, setFetchingArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // جلب مقال واحد بالـ ID (مهم جداً للـ SEO والدخول من جوجل)
  const fetchSingleArticle = async (id: string) => {
    setFetchingArticle(true);
    try {
      const res = await fetch(`${WP_API_ROOT}/posts/${id}?_embed`);
      if (res.ok) {
        const post = await res.json();
        const mapped = mapWPPost(post);
        setSelectedArticle(mapped);
      }
    } catch (error) {
      console.error("Error fetching single post:", error);
    } finally {
      setFetchingArticle(false);
    }
  };

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Basic ${credentials}` };
      const [settingsRes, catsRes, pagesRes, postsRes] = await Promise.all([
        fetch(`${WP_API_ROOT}/settings`, { headers }),
        fetch(`${WP_API_ROOT}/categories?per_page=100&hide_empty=true`), // جلب كل التصنيفات
        fetch(`${WP_API_ROOT}/pages?per_page=10`),
        fetch(`${WP_API_ROOT}/posts?_embed&per_page=30`)
      ]);

      const [settings, cats, pgs, posts] = await Promise.all([
        settingsRes.ok ? settingsRes.json() : null,
        catsRes.ok ? catsRes.json() : [],
        pagesRes.ok ? pagesRes.json() : [],
        postsRes.ok ? postsRes.json() : []
      ]);

      const mappedPosts = posts.map(mapWPPost);
      setArticles(mappedPosts);
      setCategories(cats);
      setPages(pgs);
      setSiteSettings(settings);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mapWPPost]);

  // إدارة الراوتينج الذكي
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash || '#/';
      
      if (hash === '#/') {
        setSelectedArticle(null);
        setFilteredArticles(articles);
      } else if (hash.startsWith('#category/')) {
        const slug = hash.replace('#category/', '');
        const cat = categories.find(c => c.slug === slug);
        if (cat) {
          setFilteredArticles(articles.filter(a => a.category === cat.name));
          setSelectedArticle(null);
        }
      } else if (hash.includes('/')) {
        const parts = hash.split('/');
        const id = parts[parts.length - 1];
        
        // البحث عن المقال محلياً أولاً
        const localArt = articles.find(a => a.id === id);
        if (localArt) {
          setSelectedArticle(localArt);
        } else {
          // إذا لم يوجد (مقال قديم من جوجل)، نقوم بجلبه فوراً من الـ API
          fetchSingleArticle(id);
        }
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, [articles, categories]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [articles]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        settings={siteSettings} 
        categories={categories} 
        breakingArticles={articles.slice(0, 5)} 
        onSearch={handleSearch}
      />
      
      <main className="flex-grow">
        {(loading || fetchingArticle) && !selectedArticle ? (
          <SkeletonHome />
        ) : selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => window.location.hash = '/'} 
            relatedArticles={articles.filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id).slice(0, 3)}
          />
        ) : (
          <div className="animate-in fade-in duration-500">
            <HeroSlider articles={articles} onArticleClick={(a) => window.location.hash = `/${a.slug}/${a.id}`} />
            <NewsGrid 
              articles={filteredArticles} 
              onArticleClick={(a) => window.location.hash = `/${a.slug}/${a.id}`} 
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
    <div className="w-full h-[400px] skeleton rounded-[48px] mb-12"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-4">
          <div className="aspect-[4/3] skeleton rounded-[2.5rem]"></div>
          <div className="h-6 skeleton w-3/4 rounded-md"></div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
