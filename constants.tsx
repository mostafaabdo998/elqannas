
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
    slug: 'future-ai-arab-region',
    seo: {
      metaTitle: 'مستقبل الذكاء الاصطناعي في المنطقة العربية',
      metaDescription: 'دراسة حديثة تتوقع نمواً هائلاً في قطاع التكنولوجيا خلال السنوات القادمة',
      focusKeyword: 'الذكاء الاصطناعي',
      canonicalUrl: 'https://elqannas.net/future-ai-arab-region',
      robots: 'index, follow',
      ogImage: 'https://picsum.photos/seed/tech/800/600',
      jsonLd: '{}'
    }
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
    slug: 'strategic-steps-local-economy',
    seo: {
      metaTitle: 'خطوات استراتيجية لتعزيز الاقتصاد المحلي',
      metaDescription: 'الحكومة تطلق حزمة من الحوافز لدعم المشروعات الصغيرة والمتوسطة',
      focusKeyword: 'الاقتصاد المحلي',
      canonicalUrl: 'https://elqannas.net/strategic-steps-local-economy',
      robots: 'index, follow',
      ogImage: 'https://picsum.photos/seed/economy/800/600',
      jsonLd: '{}'
    }
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
    slug: 'national-team-qualification',
    seo: {
      metaTitle: 'تأهل المنتخب لنهائيات البطولة الدولية',
      metaDescription: 'فرحة عارمة تجتاح الجماهير بعد الفوز التاريخي',
      focusKeyword: 'تأهل المنتخب',
      canonicalUrl: 'https://elqannas.net/national-team-qualification',
      robots: 'index, follow',
      ogImage: 'https://picsum.photos/seed/sports/800/600',
      jsonLd: '{}'
    }
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
    slug: 'contemporary-arts-festival',
    seo: {
      metaTitle: 'افتتاح مهرجان الفنون المعاصرة',
      metaDescription: 'فعاليات متنوعة تجمع نخبة من الفنانين من مختلف دول العالم',
      focusKeyword: 'مهرجان الفنون',
      canonicalUrl: 'https://elqannas.net/contemporary-arts-festival',
      robots: 'index, follow',
      ogImage: 'https://picsum.photos/seed/culture/800/600',
      jsonLd: '{}'
    }
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
    slug: 'health-tips-weather',
    seo: {
      metaTitle: 'نصائح صحية للوقاية من تقلبات الجو',
      metaDescription: 'خبراء الصحة يوصون باتباع نظام غذائي متوازن وتعزيز المناعة',
      focusKeyword: 'نصائح صحية',
      canonicalUrl: 'https://elqannas.net/health-tips-weather',
      robots: 'index, follow',
      ogImage: 'https://picsum.photos/seed/health/800/600',
      jsonLd: '{}'
    }
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
    slug: 'international-climate-summit',
    seo: {
      metaTitle: 'قمة دولية لمناقشة التغيرات المناخية',
      metaDescription: 'زعماء العالم يجتمعون لوضع حلول عاجلة لأزمة الاحتباس الحراري',
      focusKeyword: 'قمة المناخ',
      canonicalUrl: 'https://elqannas.net/international-climate-summit',
      robots: 'index, follow',
      ogImage: 'https://picsum.photos/seed/politics/800/600',
      jsonLd: '{}'
    }
  }
];