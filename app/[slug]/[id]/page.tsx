
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
    title: article.seo?.rank_math_title || article.title,
    description: article.seo?.rank_math_description || article.excerpt.replace(/<\/?[^>]+(>|$)/g, ""),
    keywords: article.seo?.rank_math_focus_keyword,
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

export default async function Page({ params }: Props) {
  const article = await getArticle(params.id);
  if (!article) return <div className="py-40 text-center font-black">عفواً، لم يتم العثور على هذا المقال</div>;

  // جلب مقالات ذات صلة من نفس الفئة (تبسيطاً نأخذ أول 10)
  const related = await getArticles({ page: 1 });

  return (
    <ArticleView 
      article={article} 
      relatedArticles={related.filter(a => a.id !== article.id)} 
    />
  );
}
