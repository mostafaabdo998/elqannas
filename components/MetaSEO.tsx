
'use client';

import React, { useEffect } from 'react';
import { NewsArticle, SiteSettings } from '../types';

interface MetaSEOProps {
  article?: NewsArticle;
  settings: SiteSettings;
}

const MetaSEO: React.FC<MetaSEOProps> = ({ article, settings }) => {
  useEffect(() => {
    const title = article ? article.seo.metaTitle : settings.title;
    const description = article ? article.seo.metaDescription : settings.description;
    const image = article ? article.seo.ogImage : settings.logo;
    const url = article ? article.seo.canonicalUrl : settings.url;
    const robots = article ? article.seo.robots : 'index, follow';

    // تحديث العناصر الأساسية
    document.title = title;
    
    const updateMeta = (name: string, content: string, property = false) => {
      let el = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('robots', robots);
    
    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', article ? 'article' : 'website', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // JSON-LD (Schema.org)
    if (article) {
      let script = document.getElementById('json-ld-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.innerHTML = article.seo.jsonLd;
    }

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);

  }, [article, settings]);

  return null;
};

export default MetaSEO;
