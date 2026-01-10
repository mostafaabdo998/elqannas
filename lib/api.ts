
import { NewsArticle, SiteSettings, CategoryItem, PageItem } from '../types';

const WP_API_ROOT = 'https://www.elqannas.net/wp-json/wp/v2';
const credentials = btoa('mostafaabdo99:0Gl9 aTQY dokO Ut2Y JXAG QZ3d');

const headers = {
  'Authorization': `Basic ${credentials}`,
  'Content-Type': 'application/json',
};

export async function getSettings(): Promise<SiteSettings> {
  const res = await fetch(`${WP_API_ROOT}/settings`, { headers, next: { revalidate: 3600 } } as any);
  return res.json();
}

export async function getCategories(): Promise<CategoryItem[]> {
  const res = await fetch(`${WP_API_ROOT}/categories?per_page=100&hide_empty=true`, { next: { revalidate: 3600 } } as any);
  return res.json();
}

export async function getPages(): Promise<PageItem[]> {
  const res = await fetch(`${WP_API_ROOT}/pages?per_page=10`, { next: { revalidate: 3600 } } as any);
  return res.json();
}

export async function getArticles(params: { page?: number; categories?: number; search?: string } = {}): Promise<NewsArticle[]> {
  const { page = 1, categories, search } = params;
  let url = `${WP_API_ROOT}/posts?_embed&per_page=12&page=${page}`;
  if (categories) url += `&categories=${categories}`;
  if (search) url += `&search=${search}`;

  const res = await fetch(url, { headers, next: { revalidate: 60 } } as any);
  if (!res.ok) return [];
  const posts = await res.json();
  
  return posts.map((post: any) => ({
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
      rank_math_description: post.rank_math_description,
      rank_math_focus_keyword: post.rank_math_focus_keyword,
      rank_math_head: post.rank_math_head // جلب كامل كود السيو من ووردبريس
    }
  }));
}

export async function getArticle(idOrSlug: string): Promise<NewsArticle | null> {
  let url = `${WP_API_ROOT}/posts/${idOrSlug}?_embed`;
  if (isNaN(Number(idOrSlug))) {
    url = `${WP_API_ROOT}/posts?slug=${idOrSlug}&_embed`;
  }
  
  const res = await fetch(url, { headers, next: { revalidate: 60 } } as any);
  if (!res.ok) return null;
  const data = await res.json();
  const post = Array.isArray(data) ? data[0] : data;
  if (!post) return null;

  return {
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
      rank_math_description: post.rank_math_description,
      rank_math_focus_keyword: post.rank_math_focus_keyword,
      rank_math_head: post.rank_math_head
    }
  };
}
