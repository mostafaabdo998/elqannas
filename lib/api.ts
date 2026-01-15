
import { NewsArticle, Category, CategoryItem, PageItem, SiteSettings } from '../types';

// محرك توليد SEO تلقائي
const generateSEO = (title: string, excerpt: string, slug: string, imageUrl: string): NewsArticle['seo'] => {
  const cleanExcerpt = excerpt.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160);
  const siteUrl = 'https://elqannas.net';
  const canonical = `${siteUrl}/${slug}`;
  
  return {
    metaTitle: `${title} - القناص نيوز`,
    metaDescription: cleanExcerpt,
    focusKeyword: title.split(' ').slice(0, 3).join(', '),
    canonicalUrl: canonical,
    robots: 'index, follow, max-image-preview:large',
    ogImage: imageUrl,
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "image": [imageUrl],
      "datePublished": new Date().toISOString(),
      "author": { "@type": "Person", "name": "محرر القناص" }
    })
  };
};

// بيانات أولية (بديلة للوردبريس)
const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'بــابا سني واوا تردد قناة وناسة التحديث الجديد 2026',
    excerpt: 'تعتبر قناة وناسة من القنوات العربية الرائدة في مجال الترفيه للأطفال...',
    content: '<p>تعتبر قناة وناسة من القنوات العربية الرائدة في مجال الترفيه للأطفال، حيث تقدم محتوى تربوياً ترفيهياً متميزاً يحظى بمتابعة ملايين الأسر العربية.</p><h2>تردد قناة وناسة الجديد</h2><p>يمكنكم ضبط أجهزة الاستقبال الخاصة بكم على التردد التالي لمتابعة أغاني لولو وبابا سني واوا...</p>',
    category: Category.TECHNOLOGY,
    author: 'مصطفى عبدو',
    date: '15 يناير 2026',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&h=675&auto=format&fit=crop', // مقاس جوجل ديسكفري
    slug: 'wanasa-tv-frequency-2026',
    seo: generateSEO('تردد قناة وناسة 2026', 'تعتبر قناة وناسة من القنوات العربية الرائدة...', 'wanasa-tv-frequency-2026', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f')
  },
  {
    id: '2',
    title: 'تطورات الذكاء الاصطناعي وتأثيرها على البحث العلمي 2026',
    excerpt: 'يشهد عام 2026 طفرة هائلة في تطبيقات الذكاء الاصطناعي التوليدي...',
    content: '<p>من المتوقع أن يغير الذكاء الاصطناعي ملامح البحث العلمي بشكل جذري خلال العام الحالي، مما يساهم في تسريع الاكتشافات الطبية والتقنية.</p>',
    category: Category.TECHNOLOGY,
    author: 'إدارة الموقع',
    date: '14 يناير 2026',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&h=675&auto=format&fit=crop',
    slug: 'ai-developments-2026',
    seo: generateSEO('مستقبل الذكاء الاصطناعي 2026', 'يشهد عام 2026 طفرة هائلة في تطبيقات...', 'ai-developments-2026', 'https://images.unsplash.com/photo-1677442136019-21780ecad995')
  }
];

export const getSettings = (): SiteSettings => ({
  title: 'القناص نيوز',
  description: 'بوابتك الإخبارية الموثوقة - تغطية شاملة وحصرية على مدار الساعة',
  url: 'https://elqannas.net',
  logo: '/logo.png'
});

export const getCategories = (): CategoryItem[] => [
  { id: '1', name: 'تكنولوجيا', slug: 'tech' },
  { id: '2', name: 'اقتصاد', slug: 'economy' },
  { id: '3', name: 'رياضة', slug: 'sports' },
  { id: '4', name: 'سياسة', slug: 'politics' }
];

export const getPages = (): PageItem[] => [
  { id: '1', title: 'من نحن', content: 'معلومات عن القناص نيوز', slug: 'about-us' },
  { id: '2', title: 'اتصل بنا', content: 'طرق التواصل معنا', slug: 'contact-us' },
  { id: '3', title: 'سياسة الخصوصية', content: 'سياسة الخصوصية للموقع', slug: 'privacy-policy' }
];

export const getArticles = (params: { page?: number; categories?: string } = {}): NewsArticle[] => {
  return INITIAL_ARTICLES;
};

export const getArticle = (idOrSlug: string): NewsArticle | null => {
  return INITIAL_ARTICLES.find(a => a.id === idOrSlug || a.slug === idOrSlug) || null;
};