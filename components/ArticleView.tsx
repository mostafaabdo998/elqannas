
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { NewsArticle } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface ArticleViewProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  trendingArticles: NewsArticle[];
  onBack?: () => void;
}

// Fix: Helper functions for audio decoding as per Gemini API guidelines
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, relatedArticles, trendingArticles, onBack }) => {
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(1.15); // rem
  const [isReading, setIsReading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) setProgress((window.scrollY / scrollHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsReading(false);
  };

  const handleSpeak = async () => {
    if (isReading) {
      stopAudio();
      return;
    }

    try {
      setIsReading(true);
      // Fix: Strictly follow Gemini API initialization guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // تنظيف النص من أكواد HTML قبل القراءة
      const cleanText = article.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 1500);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `اقرأ الخبر التالي بصوت هادئ وواضح ومذيع محترف باللغة العربية: ${cleanText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        
        // Fix: Use recommended audio decoding logic
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          ctx,
          24000,
          1
        );

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsReading(false);
        audioSourceRef.current = source;
        source.start();
      }
    } catch (e) {
      console.error("Audio error:", e);
      setIsReading(false);
    }
  };

  return (
    <article className="bg-white dark:bg-midnight min-h-screen pt-32 pb-20">
      <div className="fixed top-0 left-0 w-full h-1 z-[200] bg-slate-100 dark:bg-white/5">
        <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all duration-150" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            {onBack && (
              <button onClick={onBack} className="mb-10 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-600 transition-all uppercase tracking-widest">
                <span className="w-8 h-8 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center">→</span>
                العودة للرئيسية
              </button>
            )}

            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded uppercase tracking-wider">{article.category}</span>
                <span className="text-[10px] font-bold text-slate-400">{article.date}</span>
              </div>
              
              <h1 
                className="text-3xl md:text-4xl lg:text-[2.8rem] font-black text-slate-900 dark:text-white leading-[1.3] mb-8"
                dangerouslySetInnerHTML={{ __html: article.title }}
              />

              {/* Toolbar: Font Size & TTS */}
              <div className="flex flex-wrap items-center justify-between py-4 border-y border-slate-100 dark:border-white/5 mb-10 gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-1.5 rounded-xl">
                    <button 
                      onClick={() => setFontSize(prev => Math.min(prev + 0.1, 1.8))}
                      className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-midnight rounded-lg transition-all shadow-sm"
                    >
                      A+
                    </button>
                    <button 
                      onClick={() => setFontSize(prev => Math.max(prev - 0.1, 0.9))}
                      className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-midnight rounded-lg transition-all shadow-sm"
                    >
                      A-
                    </button>
                  </div>

                  <button 
                    onClick={handleSpeak}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isReading ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      {isReading ? (
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      ) : (
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      )}
                    </svg>
                    {isReading ? 'جاري القراءة...' : 'استمع للخبر'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-500">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{article.author}</div>
                    <div className="text-[10px] text-slate-400 font-medium">محرر لدى القناص</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl mb-12 bg-slate-100 dark:bg-white/5">
              <img src={article.imageUrl} className="w-full h-full object-cover" alt="" loading="lazy" />
            </div>

            <div className="article-render" style={{ fontSize: `${fontSize}rem` }}>
              <div 
                className="font-medium text-slate-500 dark:text-slate-300 mb-10 leading-relaxed italic border-r-4 border-red-600 pr-8"
                style={{ fontSize: `${fontSize * 1.1}rem` }}
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <section className="mt-20 pt-10 border-t border-slate-100 dark:border-white/5">
              <h4 className="text-xl font-black mb-10 flex items-center gap-3">
                <span className="w-2.5 h-7 bg-red-600 rounded-full"></span>
                مواضيع ذات صلة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.slice(0, 4).map(rel => (
                  <div key={rel.id} className="group cursor-pointer flex gap-5 items-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-white/5">
                      <img src={rel.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" loading="lazy" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold leading-tight group-hover:text-red-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: rel.title }} />
                      <span className="text-[10px] text-slate-400 mt-2 block font-bold">{rel.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area: Trending Articles */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-10">
              <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5">
                <h4 className="text-lg font-black mb-8 flex items-center gap-3 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  الأكثر قراءة
                </h4>
                <div className="space-y-8">
                  {trendingArticles.slice(0, 5).map((trend, idx) => (
                    <div key={trend.id} className="flex gap-4 sidebar-card p-2 rounded-xl group cursor-pointer">
                      <span className="text-2xl font-black text-slate-200 dark:text-white/10 italic shrink-0">0{idx + 1}</span>
                      <div>
                        <h5 className="text-xs font-bold leading-snug group-hover:text-red-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: trend.title }} />
                        <span className="text-[9px] font-bold text-slate-400 mt-2 block uppercase tracking-widest">{trend.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-red-600 rounded-[2rem] text-white shadow-xl shadow-red-600/20">
                <h5 className="font-black text-lg mb-4">النشرة البريدية</h5>
                <p className="text-xs font-medium text-red-100 leading-relaxed mb-6">احصل على أهم الأخبار والتحليلات مباشرة في بريدك الإلكتروني.</p>
                <input type="email" placeholder="بريدك الإلكتروني" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs placeholder:text-red-200 outline-none mb-3" />
                <button className="w-full bg-white text-red-600 font-black text-xs py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all">اشترك الآن</button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
};

export default ArticleView;
