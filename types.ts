
// Fix: Added Category enum to resolve the missing export error in constants.tsx
export enum Category {
  TECHNOLOGY = 'تكنولوجيا',
  ECONOMY = 'اقتصاد',
  SPORTS = 'رياضة',
  CULTURE = 'ثقافة',
  HEALTH = 'صحة',
  POLITICS = 'سياسة'
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
  isFeatured?: boolean;
  slug: string;
  seo?: {
    rank_math_title?: string;
    rank_math_description?: string;
    rank_math_focus_keyword?: string;
    rank_math_robots?: string[];
    rank_math_head?: string; // يحتوي على كود الميتا تاج كاملاً من رانك ماث
  };
}

export interface SiteSettings {
  title: string;
  description: string;
  url?: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

export interface PageItem {
  id: number;
  title: { rendered: string };
  link: string;
  slug: string;
}

export interface NavItem {
  label: string;
  href: string;
}
