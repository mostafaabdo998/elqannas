
import React, { useEffect } from 'react';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot = "9780246155", format = "auto", className = "" }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className={`ad-container my-12 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">مساحة إعلانية</span>
      <div className="w-full max-w-4xl bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-[100px] overflow-hidden">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', minHeight: '90px' }}
             data-ad-client="ca-pub-2050399255820518"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

export default AdUnit;