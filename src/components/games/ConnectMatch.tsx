import React, { useState, useEffect } from 'react';
import type { GamePair } from '../../types';
import { Link2, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConnectMatchProps {
  pairs: GamePair[];
}

export const ConnectMatch: React.FC<ConnectMatchProps> = ({ pairs }) => {
  const [leftItems, setLeftItems] = useState<GamePair[]>([]);
  const [rightItems, setRightItems] = useState<GamePair[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);

  // Initialize and shuffle
  useEffect(() => {
    resetGame();
  }, [pairs]);

  const resetGame = () => {
    // Keep left items in original order (or shuffle them too)
    setLeftItems([...pairs].sort(() => Math.random() - 0.5));
    // Always shuffle right items
    setRightItems([...pairs].sort(() => Math.random() - 0.5));
    
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setWrongMatch(false);
  };

  // Match logic
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Match!
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
        
        setMatchedIds(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Wrong Match!
        setWrongMatch(true);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2839/2839-preview.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});

        setTimeout(() => {
          setWrongMatch(false);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  // Win condition
  useEffect(() => {
    if (matchedIds.length === pairs.length && pairs.length > 0) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#F472B6', '#3B82F6']
      });
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.play().catch(() => {});
    }
  }, [matchedIds, pairs.length]);

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col items-center" dir="rtl">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 bg-surface p-4 md:p-6 rounded-2xl border border-border-subtle shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-electric/10 text-electric rounded-xl">
            <Link2 size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-text-main">وصل بين الكلمات</h2>
            <p className="text-sm text-text-muted">اضغط على الكلمة ثم اضغط على ما يطابقها</p>
          </div>
        </div>
        <div className="text-left font-bold text-text-main flex items-center gap-2 bg-base px-4 py-2 rounded-xl border border-border-subtle">
           النتيجة : <span className="text-electric ml-2">{matchedIds.length} / {pairs.length}</span>
        </div>
      </div>

      {/* Win State */}
      {matchedIds.length === pairs.length && pairs.length > 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <Trophy size={64} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-main mb-4">ممتاز! أكملت التوصيل</h2>
          <button 
            onClick={resetGame}
            className="mt-8 px-8 py-4 bg-electric hover:bg-electric-hover text-white rounded-xl font-bold text-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-electric/20"
          >
            <RotateCcw size={24} />
            العب مرة أخرى
          </button>
        </div>
      ) : (
        /* Game Board (Side by side columns) */
        <div className="w-full max-w-5xl flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pb-12">
          
          {/* Left Column (Questions) */}
          <div className="flex flex-col gap-4 relative">
             <div className="text-center mb-2 font-bold text-text-muted text-sm uppercase tracking-wider">الــمــفــاهــيــم</div>
             {leftItems.map((item) => {
               const isMatched = matchedIds.includes(item.id);
               const isSelected = selectedLeft === item.id;
               const isWrong = isSelected && wrongMatch;

               let buttonClasses = "relative w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm flex items-center justify-between group overflow-hidden ";
               
               if (isMatched) {
                  buttonClasses += "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 opacity-60 scale-95 pointer-events-none";
               } else if (isWrong) {
                  buttonClasses += "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-600 animate-shake";
               } else if (isSelected) {
                  buttonClasses += "bg-electric/10 border-electric text-electric shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.02] z-10";
               } else {
                  buttonClasses += "bg-surface border-border-subtle hover:border-electric/50 text-text-main hover:scale-[1.01] active:scale-95 cursor-pointer";
               }

               return (
                 <button 
                   key={`left-${item.id}`}
                   disabled={isMatched || wrongMatch}
                   onClick={() => setSelectedLeft(item.id === selectedLeft ? null : item.id)}
                   className={buttonClasses}
                 >
                   <span className="font-bold text-lg md:text-xl pr-2">{item.question}</span>
                   {isMatched && <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />}
                   {isSelected && !isMatched && !isWrong && (
                     <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-electric animate-ping" />
                   )}
                 </button>
               );
             })}
          </div>

          {/* Right Column (Answers) */}
          <div className="flex flex-col gap-4 relative">
             <div className="text-center mb-2 font-bold text-text-muted text-sm uppercase tracking-wider">الإجــابــات</div>
             {rightItems.map((item) => {
               const isMatched = matchedIds.includes(item.id);
               const isSelected = selectedRight === item.id;
               const isWrong = isSelected && wrongMatch;

               let buttonClasses = "relative w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm flex items-center justify-between group overflow-hidden ";
               
               if (isMatched) {
                  buttonClasses += "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 opacity-60 scale-95 pointer-events-none";
               } else if (isWrong) {
                  buttonClasses += "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-600 animate-shake";
               } else if (isSelected) {
                  buttonClasses += "bg-electric/10 border-electric text-electric shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.02] z-10";
               } else {
                  buttonClasses += "bg-surface border-border-subtle hover:border-electric/50 text-text-main hover:scale-[1.01] active:scale-95 cursor-pointer";
               }

               return (
                 <button 
                   key={`right-${item.id}`}
                   disabled={isMatched || wrongMatch}
                   onClick={() => setSelectedRight(item.id === selectedRight ? null : item.id)}
                   className={buttonClasses}
                 >
                   {isSelected && !isMatched && !isWrong && (
                     <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-electric animate-ping" />
                   )}
                   <span className="font-bold text-lg md:text-xl pr-2" dir="auto">{item.answer}</span>
                   {isMatched && <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />}
                 </button>
               );
             })}
          </div>

        </div>
      )}
    </div>
  );
};
