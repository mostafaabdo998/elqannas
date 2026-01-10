
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

// دالة فك التشفير Base64 اليدوية (مطلوبة لـ Gemini Audio)
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// دالة تحويل PCM إلى AudioBuffer (مطلوبة لـ Gemini Audio)
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
  const [fontSize, setFontSize] = useState(1.4); // حجم خط المقال الافتراضي (درجتين فوق المعتاد)
  const [isReading, setIsReading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  
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
    setLoadingAudio(false);
  };

  const handleSpeak = async () => {
    if (isReading || loadingAudio) {
      stopAudio();
      return;
    }

    try {
      setLoadingAudio(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // تجهيز النص للقراءة (العنوان + مقتطف + جزء من المحتوى)
      const textToRead = `خبر من القناص نيوز. العنوان: ${article.title}. التفاصيل: ${article.excerpt.replace(/<\/?[^>]+(>|$)/g, "")}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `اقرأ الخبر التالي بصوت إذاعي فصيح وواضح باللغة العربية: ${textToRead}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // صوت هادئ ومميز
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
        if (ctx.state === 'suspended') await ctx.resume();

        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsReading(false);
        
        audioSourceRef.current = source;
        setIsReading(true);
        setLoadingAudio(false);
        source.start();
      }
    } catch (e) {
      console.error("Audio error:", e);
      setIsReading(false);
      setLoadingAudio(false);
    }
  };

  return (
    <article className="bg-white dark:bg-midnight min-h-screen pt-32 pb-20">
      <div className="fixed top-0 left-0 w-full h-1.5 z-[200] bg-slate-100 dark:bg-white/5">
        <div className="h-full bg-red-600 shadow-[0_0_10px_#E11D48]" style={{ width: `${progress}%`, transition: 'width 0.1s' }}></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* المحتوى الرئيسي */}
          <div className="flex-1 max-w-4xl">
            {onBack && (
              <button onClick={onBack} className="mb-8 flex items-center gap-3 text-xs font-black text-slate-400 hover:text-red-600 transition-all uppercase tracking-widest group">
                <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">→</span>
                العودة للرئيسية
              </button>
            )}

            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-red-600 text-white text-[11px] font-black rounded uppercase tracking-wider">{article.category}</span>
                <span className="text-[11px] font-bold text-slate-400">{article.date}</span>
              </div>
              
              <h1 
                className="text-4xl md:text-5xl lg:text-[3.2rem] font-black text-slate-900 dark:text-white leading-[1.2] mb-10 tracking-tight"
                dangerouslySetInnerHTML={{ __html: article.title }}
              />

              {/* أدوات التحكم: تكبير الخط والصوت */}
              <div className="flex flex-wrap items-center justify-between py-6 border-y border-slate-100 dark:border-white/5 mb-12 gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                    <button 
                      onClick={() => setFontSize(f => Math.min(f + 0.1, 2.0))}
                      className="w-12 h-12 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-midnight rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      A+
                    </button>
                    <button 
                      onClick={() => setFontSize(f => Math.max(f - 0.1, 1.0))}
                      className="w-12 h-12 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-midnight rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      A-
                    </button>
                  </div>

                  <button 
                    onClick={handleSpeak}
                    disabled={loadingAudio}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 ${
                      isReading 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : loadingAudio
                      ? 'bg-slate-300 text-slate-500 cursor-wait'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {isReading ? (
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      ) : (
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      )}
                    </svg>
                    {loadingAudio ? 'جاري التحضير...' : isReading ? 'إيقاف الاستماع' : 'استمع للخبر'}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center font-black text-slate-600 dark:text-slate-400 text-lg">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{article.author}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">محرر في القناص</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="rounded-[3rem] overflow-hidden aspect-video shadow-2xl mb-16 bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <img src={article.imageUrl} className="w-full h-full object-cover" alt="" loading="lazy" />
            </div>

            <div className="article-render leading-[2.1]" style={{ fontSize: `${fontSize}rem` }}>
              <div 
                className="font-bold text-slate-600 dark:text-slate-300 mb-12 leading-relaxed italic border-r-8 border-red-600 pr-10 bg-slate-50 dark:bg-white/5 py-10 rounded-l-[2rem]"
                style={{ fontSize: `${fontSize * 1.15}rem` }}
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
              <div className="content-body" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <section className="mt-24 pt-16 border-t border-slate-100 dark:border-white/5">
              <h4 className="text-2xl font-black mb-12 flex items-center gap-4">
                <span className="w-3.5 h-8 bg-red-600 rounded-full"></span>
                مواضيع ذات صلة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {relatedArticles.slice(0, 4).map(rel => (
                  <div key={rel.id} className="group cursor-pointer flex gap-6 items-center">
                    <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden shrink-0 bg-slate-100 dark:bg-white/5 shadow-md">
                      <img src={rel.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" loading="lazy" />
                    </div>
                    <div>
                      <h5 className="text-base font-black leading-tight group-hover:text-red-600 transition-colors line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: rel.title }} />
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rel.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* الشريط الجانبي (Sidebar) */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-12">
              <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                <h4 className="text-xl font-black mb-10 flex items-center gap-4 text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  الأكثر زيارة
                </h4>
                <div className="space-y-10">
                  {trendingArticles.slice(0, 6).map((trend, idx) => (
                    <div key={trend.id} className="flex gap-5 sidebar-card group cursor-pointer items-start">
                      <span className="text-4xl font-black text-slate-200 dark:text-white/10 italic shrink-0 leading-none">0{idx + 1}</span>
                      <div>
                        <h5 className="text-sm font-black leading-snug group-hover:text-red-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: trend.title }} />
                        <span className="text-[9px] font-black text-slate-400 mt-2 block uppercase tracking-widest">{trend.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 bg-midnight rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[80px]"></div>
                <h5 className="font-black text-xl mb-6 relative z-10">اشترك في النشرة</h5>
                <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 relative z-10">احصل على أهم التحليلات يومياً في بريدك</p>
                <input type="email" placeholder="البريد الإلكتروني" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none mb-4 focus:border-red-600 transition-all text-white" />
                <button className="w-full bg-red-600 text-white font-black text-[10px] py-4 rounded-2xl hover:bg-white hover:text-red-600 transition-all shadow-xl shadow-red-600/20 uppercase tracking-[0.2em]">تأكيد الاشتراك</button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
};

export default ArticleView;
