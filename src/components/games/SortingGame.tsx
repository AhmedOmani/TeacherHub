import React, { useState, useEffect, useMemo } from 'react';
import type { GamePair } from '../../types';
import { Layers, CheckCircle2, Trophy, RotateCcw, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SortingGameProps {
  pairs: GamePair[];
}

export const SortingGame: React.FC<SortingGameProps> = ({ pairs }) => {
  const [items, setItems] = useState<GamePair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongBucket, setWrongBucket] = useState<string | null>(null);
  const [animatingSuccess, setAnimatingSuccess] = useState(false);

  // Extract unique answers to act as buckets
  const buckets = useMemo(() => {
    const uniqueAnswers = new Set(pairs.map(p => p.answer));
    return Array.from(uniqueAnswers);
  }, [pairs]);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, [pairs]);

  const resetGame = () => {
    setItems([...pairs].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setWrongBucket(null);
    setAnimatingSuccess(false);
  };

  const handleBucketClick = (bucketName: string) => {
    if (animatingSuccess || currentIndex >= items.length) return;

    const currentItem = items[currentIndex];

    if (currentItem.answer === bucketName) {
      // Correct!
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});

      setScore(s => s + 1);
      setAnimatingSuccess(true);
      
      setTimeout(() => {
        setAnimatingSuccess(false);
        setCurrentIndex(i => i + 1);
      }, 600);
      
    } else {
      // Wrong!
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2839/2839-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});

      setWrongBucket(bucketName);
      setTimeout(() => {
        setWrongBucket(null);
      }, 800);
    }
  };

  const hasWon = items.length > 0 && currentIndex >= items.length;

  useEffect(() => {
    if (hasWon) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#F472B6', '#3B82F6']
      });
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.play().catch(() => {});
    }
  }, [hasWon]);

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col items-center" dir="rtl">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 bg-surface p-4 md:p-6 rounded-2xl border border-border-subtle shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-electric/10 text-electric rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-text-main">لعبة التصنيف</h2>
            <p className="text-sm text-text-muted">اختر الصندوق الصحيح للكلمة المعروضة</p>
          </div>
        </div>
        <div className="text-left font-bold text-text-main flex items-center gap-2 bg-base px-4 py-2 rounded-xl border border-border-subtle">
           الإنجاز : <span className="text-electric ml-2">{score} / {items.length}</span>
        </div>
      </div>

      {/* Win State */}
      {hasWon ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <Trophy size={64} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-main mb-4">عمل رائع! أكملت التصنيف</h2>
          <button 
            onClick={resetGame}
            className="mt-8 px-8 py-4 bg-electric hover:bg-electric-hover text-white rounded-xl font-bold text-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-electric/20"
          >
            <RotateCcw size={24} />
            العب مرة أخرى
          </button>
        </div>
      ) : items.length > 0 ? (
        /* Game Board */
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-start gap-8 md:gap-12 pb-12">
          
          {/* Active Item to Sort */}
          <div className="w-full flex justify-center mb-4">
            <div className={`relative px-8 py-10 md:px-16 md:py-16 w-full max-w-xl bg-surface border-[3px] rounded-3xl shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300 ${animatingSuccess ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 scale-95 opacity-0' : 'border-electric shadow-[0_0_40px_rgba(139,92,246,0.15)] scale-100 opacity-100'}`}>
               <p className="text-sm font-black text-electric tracking-widest mb-4 uppercase bg-electric/10 px-4 py-1.5 rounded-full border border-electric/20">أي صندوق يناسب هذه الكلمة؟</p>
               <h2 className="text-4xl md:text-6xl font-extrabold text-text-main leading-tight drop-shadow-sm max-w-full overflow-hidden text-ellipsis" style={{ wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                 {items[currentIndex]?.question}
               </h2>
               
               {animatingSuccess && (
                 <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 rounded-3xl backdrop-blur-sm z-10">
                   <CheckCircle2 size={64} className="text-emerald-500 drop-shadow-lg" />
                 </div>
               )}
            </div>
          </div>

          {/* Buckets Grid */}
          <div className="w-full">
            <div className="text-center mb-6 font-bold text-text-muted text-lg tracking-wider">الصناديق المتاحة</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-center">
              {buckets.map((bucket, i) => {
                const isWrong = wrongBucket === bucket;
                let btnClasses = "p-6 rounded-3xl border-2 hover:border-b-8 hover:-translate-y-2 active:translate-y-0 active:border-b-2 transition-all duration-200 shadow-md flex flex-col items-center justify-center min-h-[140px] ";
                
                if (isWrong) {
                   btnClasses += "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-600 animate-shake";
                } else {
                   btnClasses += "bg-base border-border-subtle hover:border-electric text-text-main";
                }

                return (
                  <button
                    key={i}
                    disabled={animatingSuccess || isWrong}
                    onClick={() => handleBucketClick(bucket)}
                    className={btnClasses}
                  >
                    {isWrong ? <XCircle size={32} className="mb-3 text-red-500" /> : <Layers size={32} className="mb-3 text-electric opacity-50" />}
                    <h3 className="text-xl md:text-2xl font-bold max-w-full truncate px-2">{bucket}</h3>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};
