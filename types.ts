
export enum Category {
  TECHNOLOGY = 'تكنولوجيا',
  ECONOMY = 'اقتصاد',
  SPORTS = 'رياضة',
  CULTURE = 'ثقافة',
  HEALTH = 'صحة',
  POLITICS = 'سياسة'
}

export interface NavItem {
  label: string;
  href: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  isFeatured?: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    canonicalUrl: string;
    robots: string; // index, follow
    ogImage: string;
    jsonLd: string; // Schema.org Script
  };
}

export interface SiteSettings {
  title: string;
  description: string;
  url: string;
  logo: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface PageItem {
  id: string;
  title: string;
  content: string;
  slug: string;
}