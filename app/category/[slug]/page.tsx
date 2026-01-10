
import { getArticles, getCategories } from '../../../lib/api';
import NewsGrid from '../../../components/NewsGrid';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await getCategories();
  const cat = categories.find(c => c.slug === params.slug);
  return {
    title: `${cat?.name || 'قسم'} | القناص نيوز`,
    description: `تابع آخر الأخبار والمستجدات في قسم ${cat?.name} عبر بوابة القناص نيوز.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const categories = await getCategories();
  const currentCat = categories.find(c => c.slug === params.slug);
  
  if (!currentCat) return <div className="py-40 text-center">القسم غير موجود</div>;

  const articles = await getArticles({ categories: currentCat.id });

  return (
    <div className="animate-in fade-in duration-700 bg-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-black mb-4 tracking-tighter">
          {currentCat.name}
        </h1>
        <div className="w-24 h-2 bg-red-600 mx-auto rounded-full shadow-lg shadow-red-600/20"></div>
      </div>
      <NewsGrid articles={articles} />
    </div>
  );
}
