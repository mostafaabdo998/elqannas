
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import NewsGrid from './components/NewsGrid';
import Footer from './components/Footer';
import ArticleView from './components/ArticleView';
import AdUnit from './components/AdUnit';
import { NewsArticle, SiteSettings, CategoryItem, PageItem } from './types';

const WP_API_ROOT = 'https://www.elqannas.net/wp-json/wp/v2';
const username = 'mostafaabdo99';
const password = '0Gl9 aTQY dokO Ut2Y JXAG QZ3d';
const credentials = btoa(`${username}:${password}`);

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const applyRankMathSEO = (article: NewsArticle | null) => {
    const defaultTitle = siteSettings?.title || 'القناص نيوز';
    const defaultDesc = siteSettings?.description || 'بوابتك للخبر والتحليل';

    if (!article) {
      document.title = defaultTitle;
      return;
    }

    const title = article.seo?.rank_math_title || article.title.replace(/<\/?[^>]+(>|$)/g, "");
    const desc = article.seo?.rank_math_description || article.excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    
    document.title = `${title} | ${defaultTitle}`;
    
    const updateMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', desc);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', desc);
    updateMeta('meta[property="og:image"]', article.imageUrl);

    // إضافة JSON-LD للـ SEO
    let script = document.getElementById('json-ld-article');
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-article';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "image": [article.imageUrl],
      "datePublished": article.date,
      "author": [{ "@type": "Person", "name": article.author }]
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Basic ${credentials}` };
        const [settingsRes, catsRes, pagesRes, postsRes] = await Promise.all([
          fetch(`${WP_API_ROOT}/settings`, { headers }),
          fetch(`${WP_API_ROOT}/categories?per_page=20&hide_empty=true`),
          fetch(`${WP_API_ROOT}/pages?per_page=6`),
          fetch(`${WP_API_ROOT}/posts?_embed&per_page=50`)
        ]);

        if (settingsRes.ok) setSiteSettings(await settingsRes.json());
        if (catsRes.ok) setCategories(await catsRes.json());
        if (pagesRes.ok) setPages(await pagesRes.json());
        if (postsRes.ok) {
          const posts = await postsRes.json();
          const mapped = posts.map(mapWPPost);
          setArticles(mapped);
          setFilteredArticles(mapped);
        }
        setLoading(false);
      } catch (error) {
        console.error('Data Load Error:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapWPPost = (post: any): NewsArticle => ({
    id: post.id.toString(),
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'عام',
    author: post._embedded?.['author']?.[0]?.name || 'القناص',
    date: new Date(post.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
    imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/800/450`,
    slug: post.slug,
    seo: {
      rank_math_title: post.rank_math_title,
      rank_math_description: post.rank_math_description,
    }
  });

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash || '#/';
      if (hash === '#/') {
        setSelectedArticle(null);
        setCurrentCategory(null);
        setFilteredArticles(articles);
        applyRankMathSEO(null);
      } else if (hash.startsWith('#category/')) {
        const categorySlug = hash.replace('#category/', '');
        const category = categories.find(c => c.slug === categorySlug);
        if (category) {
          setCurrentCategory(category.name);
          setFilteredArticles(articles.filter(a => a.category === category.name));
          setSelectedArticle(null);
          window.scrollTo(0, 0);
        }
      } else if (hash.includes('/')) {
        const parts = hash.split('/');
        const id = parts[parts.length - 1];
        const art = articles.find(a => a.id === id);
        if (art) {
          setSelectedArticle(art);
          applyRankMathSEO(art);
          window.scrollTo(0, 0);
        }
      }
    };
    if (!loading) {
      window.addEventListener('hashchange', handleRoute);
      handleRoute();
    }
    return () => window.removeEventListener('hashchange', handleRoute);
  }, [articles, categories, loading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-xl font-black text-gray-900 animate-pulse">جاري تحضير الخبر...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Header 
        settings={siteSettings} 
        categories={categories} 
        breakingArticles={articles.slice(0, 5)} 
        onSearch={handleSearch}
      />
      
      <main className="flex-grow">
        {selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => window.location.hash = '/'} 
            relatedArticles={articles.filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id).slice(0, 3)}
          />
        ) : (
          <div className="animate-in fade-in duration-500">
            {currentCategory || searchQuery ? (
              <div className="container mx-auto px-4 py-12 border-b border-gray-100">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                  {searchQuery ? `نتائج البحث عن: ${searchQuery}` : currentCategory}
                </h2>
                <div className="h-1 w-20 bg-red-600 mt-4"></div>
              </div>
            ) : (
              <HeroSlider articles={articles} onArticleClick={(a) => window.location.hash = `/${a.slug}/${a.id}`} />
            )}
            
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

export default App;
