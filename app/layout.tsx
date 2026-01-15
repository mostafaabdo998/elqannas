// Fix: Added missing React import to resolve "Cannot find namespace 'React'" error
import React from 'react';
import './globals.css';
import { getSettings, getCategories, getPages, getArticles } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, pages, breaking] = await Promise.all([
    getSettings(),
    getCategories(),
    getPages(),
    getArticles({ page: 1 })
  ]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-white text-black antialiased">
        <Header 
          settings={settings} 
          categories={categories} 
          breakingArticles={breaking.slice(0, 5)} 
        />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer 
          settings={settings} 
          categories={categories} 
          pages={pages} 
        />
      </body>
    </html>
  );
}