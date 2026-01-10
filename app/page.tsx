import { getArticles } from '../lib/api';
import HeroSlider from '../components/HeroSlider';
import NewsGrid from '../components/NewsGrid';

export default async function HomePage() {
  const articles = await getArticles({ page: 1 });

  return (
    <div className="animate-in fade-in duration-1000">
      <HeroSlider articles={articles} />
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tighter">أحدث الاكتشافات</h2>
        <div className="w-20 h-2 bg-red-600 mx-auto rounded-full"></div>
      </div>
      {/* Fix: Changed initialArticles to articles to match NewsGridProps definition */}
      <NewsGrid articles={articles} />
    </div>
  );
}