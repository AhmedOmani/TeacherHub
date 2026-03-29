import React, { useState } from 'react';
import type { GamePair } from '../../types';
import { ChevronRight, ChevronLeft, RotateCw } from 'lucide-react';

interface FlashcardsProps {
  pairs: GamePair[];
}

export const Flashcards: React.FC<FlashcardsProps> = ({ pairs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % pairs.length);
    }, 150); // slight delay to unflip before changing content
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
    }, 150);
  };

  const currentPair = pairs[currentIndex];

  if (!currentPair) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative z-10 min-h-[500px]" dir="rtl">
      
      {/* Progress tracker */}
      <div className="mb-4 md:mb-8 flex items-center justify-between w-full max-w-2xl px-4 shrink-0">
        <span className="text-sm font-bold text-text-main bg-surface px-5 py-2.5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-2">
          <span>بطاقة</span> 
          <span className="text-electric font-black">{currentIndex + 1}</span> 
          <span className="text-text-muted">من</span> 
          <span>{pairs.length}</span>
        </span>
        <div className="flex gap-2" dir="ltr">
          {pairs.map((_, idx) => (
             <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-electric shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'w-2 bg-border-subtle'}`} />
          ))}
        </div>
      </div>

      {/* The 3D Card Container */}
      <div 
        className="relative w-full max-w-2xl h-[40vh] min-h-[200px] max-h-[400px] cursor-pointer group shrink-0" 
        style={{ perspective: '1000px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className="w-full h-full absolute transition-all duration-700 shadow-2xl rounded-[32px] group-hover:scale-[1.02]"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front of Card (Question) */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center bg-surface border-2 border-border-subtle rounded-[32px] shadow-sm overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-0 bg-base opacity-50 rounded-[32px]" />
            <div className="absolute top-4 right-4 md:top-6 md:right-6 text-electric opacity-50 bg-electric/10 p-2 md:p-3 rounded-full"><RotateCw size={20} className="md:w-6 md:h-6"/></div>
            <p className="text-xs md:text-sm font-black text-text-muted tracking-wide mb-4 whitespace-nowrap uppercase relative z-10 bg-base px-4 py-1.5 rounded-full border border-border-subtle shadow-sm drop-shadow-sm">الــســؤال</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main leading-tight drop-shadow-sm max-w-full overflow-hidden text-ellipsis relative z-10" style={{ wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>{currentPair.question}</h2>
            <p className="absolute bottom-4 md:bottom-6 text-sm text-electric font-bold opacity-0 group-hover:opacity-100 transition-opacity animate-pulse">إضغط لقلب البطاقة 👆</p>
          </div>

          {/* Back of Card (Answer) */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center bg-gradient-to-br from-electric/10 to-purple-500/10 border-2 border-electric rounded-[32px] shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xs md:text-sm font-black text-electric tracking-wide mb-4 whitespace-nowrap uppercase bg-electric/10 px-4 py-1.5 rounded-full border border-electric/20">الإجــابــة</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-electric leading-tight drop-shadow-md max-w-full overflow-hidden text-ellipsis" style={{ wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>{currentPair.answer}</h2>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 md:mt-10 flex items-center justify-center gap-4 md:gap-8 pb-4 shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }} 
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface border-[3px] border-border-subtle hover:border-electric text-text-main flex items-center justify-center shadow-lg hover:shadow-electric/20 hover:scale-110 active:scale-95 transition-all text-2xl group"
        >
          <ChevronRight size={32} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }} 
          className="px-6 py-4 md:px-10 mt-1 md:py-5 rounded-2xl bg-electric text-white font-black tracking-wide shadow-xl shadow-electric/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-electric/40 active:translate-y-0 transition-all flex items-center gap-3 text-base md:text-lg"
        >
          <RotateCw size={20} className={`md:w-6 md:h-6 ${isFlipped ? 'animate-spin-once' : ''}`} />
          {isFlipped ? 'العودة' : 'الإجابة'}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); prevCard(); }} 
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface border-[3px] border-border-subtle hover:border-electric text-text-main flex items-center justify-center shadow-lg hover:shadow-electric/20 hover:scale-110 active:scale-95 transition-all text-2xl group"
        >
          <ChevronLeft size={32} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
