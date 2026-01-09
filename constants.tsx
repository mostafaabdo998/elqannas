
import { NewsArticle, NavItem, Category } from './types';

export const BREAKING_NEWS_ITEMS = [
  "عاجل: الإعلان عن مبادرة اقتصادية كبرى لدعم الاستثمار الرقمي في المنطقة.",
  "تطورات جديدة في سوق العملات العالمية وتوقعات باستقرار الأسعار.",
  "فوز المنتخب الوطني في مباراة ودية استعداداً للبطولة القادمة.",
  "إطلاق أول منصة ذكاء اصطناعي لدعم المحتوى العربي في دبي."
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'سياسة', href: '#politics' },
  { label: 'اقتصاد', href: '#economy' },
  { label: 'تكنولوجيا', href: '#tech' },
  { label: 'رياضة', href: '#sports' },
  { label: 'صحة', href: '#health' },
  { label: 'ثقافة', href: '#culture' }
];

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'مستقبل الذكاء الاصطناعي في المنطقة العربية',
    excerpt: 'دراسة حديثة تتوقع نمواً هائلاً في قطاع التكنولوجيا خلال السنوات الخمس القادمة...',
    content: 'تفاصيل الخبر الكاملة حول الذكاء الاصطناعي وتأثيره على سوق العمل العربي والفرص المتاحة للشركات الناشئة في هذا المجال الحيوي الذي يشهد طفرة تقنية غير مسبوقة.',
    category: Category.TECHNOLOGY,
    author: 'أحمد محمود',
    date: 'منذ ساعتين',
    imageUrl: 'https://picsum.photos/seed/tech/800/600',
    isFeatured: true,
    // Added missing slug
    slug: 'future-ai-arab-region'
  },
  {
    id: '2',
    title: 'خطوات استراتيجية لتعزيز الاقتصاد المحلي',
    excerpt: 'الحكومة تطلق حزمة من الحوافز لدعم المشروعات الصغيرة والمتوسطة...',
    content: 'المحتوى الكامل للاقتصاد...',
    category: Category.ECONOMY,
    author: 'سارة خالد',
    date: 'منذ 4 ساعات',
    imageUrl: 'https://picsum.photos/seed/economy/800/600',
    isFeatured: true,
    // Added missing slug
    slug: 'strategic-steps-local-economy'
  },
  {
    id: '3',
    title: 'تأهل المنتخب لنهائيات البطولة الدولية',
    excerpt: 'فرحة عارمة تجتاح الجماهير بعد الفوز التاريخي في المباراة الفاصلة...',
    content: 'المحتوى الرياضي...',
    category: Category.SPORTS,
    author: 'ياسين علي',
    date: 'منذ 5 ساعات',
    imageUrl: 'https://picsum.photos/seed/sports/800/600',
    // Added missing slug
    slug: 'national-team-qualification'
  },
  {
    id: '4',
    title: 'افتتاح مهرجان الفنون المعاصرة',
    excerpt: 'فعاليات متنوعة تجمع نخبة من الفنانين من مختلف دول العالم...',
    content: 'المحتوى الثقافي...',
    category: Category.CULTURE,
    author: 'ليلى مراد',
    date: 'منذ 6 ساعات',
    imageUrl: 'https://picsum.photos/seed/culture/800/600',
    // Added missing slug
    slug: 'contemporary-arts-festival'
  },
  {
    id: '5',
    title: 'نصائح صحية للوقاية من تقلبات الجو',
    excerpt: 'خبراء الصحة يوصون باتباع نظام غذائي متوازن وتعزيز المناعة...',
    content: 'محتوى صحي...',
    category: Category.HEALTH,
    author: 'د. منى سعيد',
    date: 'منذ 8 ساعات',
    imageUrl: 'https://picsum.photos/seed/health/800/600',
    // Added missing slug
    slug: 'health-tips-weather'
  },
  {
    id: '6',
    title: 'قمة دولية لمناقشة التغيرات المناخية',
    excerpt: 'زعماء العالم يجتمعون لوضع حلول عاجلة لأزمة الاحتباس الحراري...',
    content: 'محتوى سياسي...',
    category: Category.POLITICS,
    author: 'جمال عبدالناصر',
    date: 'اليوم صباحاً',
    imageUrl: 'https://picsum.photos/seed/politics/800/600',
    // Added missing slug
    slug: 'international-climate-summit'
  }
];
