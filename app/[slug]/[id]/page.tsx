
import { getArticle, getArticles } from '../../../lib/api';
import ArticleView from '../../../components/ArticleView';
import { Metadata } from 'next';

interface Props {
  params: { slug: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.id);
  if (!article) return { title: 'مقال غير موجود' };

  // سحب البيانات من رانك ماث مع قيم بديلة
  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt.replace(/<\/?[^>]+(>|$)/g, ""),
    keywords: article.seo?.focusKeyword,
    openGraph: {
      title: article.title,
      description: article.excerpt.replace(/<\/?[^>]+(>|$)/g, ""),
      images: [{ url: article.imageUrl }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt.replace(/<\/?[^>]+(>|$)/g, ""),
      images: [article.imageUrl],
    }
  };
}

// Fix: Provided missing trendingArticles prop to ArticleView
export default async function Page({ params }: Props) {
  const article = await getArticle(params.id);
  if (!article) return <div className="py-40 text-center font-black">عفواً، لم يتم العثور على هذا المقال</div>;

  // جلب مقالات لاستخدامها في الأقسام الجانبية والمقالات ذات الصلة
  const articles = await getArticles({ page: 1 });
  const related = articles.filter(a => a.id !== article.id);
  const trending = articles.slice().reverse().slice(0, 6);

  return (
    <ArticleView 
      article={article} 
      relatedArticles={related} 
      trendingArticles={trending}
    />
  );
}