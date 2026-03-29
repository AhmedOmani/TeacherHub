import React, { useState, useEffect } from 'react';
import type { GamePair } from '../../types';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface MemoryMatchProps {
  pairs: GamePair[];
}

interface Card {
  id: string; // unique for the card in the grid
  pairId: string; // to track match
  content: string;
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ pairs }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = () => {
    // Only use up to 10 pairs maximum for memory match to prevent the grid from being impossibly huge
    const slicedPairs = pairs.slice(0, 10);
    
    const newCards: Card[] = [];
    slicedPairs.forEach((p, i) => {
      newCards.push({ id: `q-${i}-${crypto.randomUUID()}`, pairId: p.id, content: p.question, type: 'question', isFlipped: false, isMatched: false });
      newCards.push({ id: `a-${i}-${crypto.randomUUID()}`, pairId: p.id, content: p.answer, type: 'answer', isFlipped: false, isMatched: false });
    });
    
    // Fisher-Yates shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    
    setCards(newCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Update UI instantly for the flip
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairs(prev => prev + 1);
          setIsLocked(false);
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1200);
      }
    }
  };

  const currentPairCount = Math.min(pairs.length, 10);
  const isWin = matchedPairs === currentPairCount && currentPairCount > 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 md:p-8 relative z-10" dir="rtl">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between w-full max-w-5xl px-4 bg-surface/50 p-4 border border-border-subtle rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-text-main bg-base px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
            <span>التطابق:</span> 
            <span className="text-electric font-black text-lg">{matchedPairs}</span> 
            <span className="text-text-muted">/</span> 
            <span className="text-lg">{currentPairCount}</span>
          </span>
        </div>
        <button 
          onClick={initializeGame}
          className="px-6 py-3 flex items-center gap-2 bg-base hover:bg-electric hover:text-white text-text-main font-bold border border-border-subtle hover:border-electric transition-all rounded-2xl shadow-sm group"
        >
          <RefreshCw size={20} className="group-hover:animate-spin-once" />
          <span>إعادة الخلط</span>
        </button>
      </div>

      {isWin ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500 pb-20">
           <div className="w-32 h-32 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
             <CheckCircle2 size={64} />
           </div>
           <h2 className="text-5xl font-extrabold text-text-main mb-4 drop-shadow-sm">ممتاز! التحدي مكتمل 🏆</h2>
           <p className="text-text-muted text-xl font-medium mb-12">لقد كشفت وتذكرت جميع البطاقات بنجاح.</p>
           <button onClick={initializeGame} className="px-10 py-4 bg-electric text-white font-bold rounded-2xl hover:bg-electric/90 shadow-xl shadow-electric/25 hover:shadow-electric/40 hover:-translate-y-1 transition-all text-lg flex items-center gap-3">
             <RefreshCw size={24} /> العب مرة أخرى
           </button>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex-1 flex flex-col justify-center pb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 auto-rows-fr">
              {cards.map((card, index) => (
                <div 
                  key={card.id} 
                  className={`relative aspect-[3/4] cursor-pointer group ${card.isMatched ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100'} transition-all duration-700`}
                  style={{ perspective: '1000px' }}
                  onClick={() => handleCardClick(index)}
                >
                  <div 
                    className={`w-full h-full absolute transition-transform duration-500 shadow-md rounded-[24px] ${card.isFlipped ? 'rotate-y-180' : 'group-hover:-translate-y-1 group-hover:shadow-xl'}`}
                    style={{ transformStyle: 'preserve-3d', transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    {/* Back of card (Hidden state) */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-surface border-2 border-border-subtle rounded-[24px]"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-base to-surface rounded-[24px] opacity-50" />
                      <div className="w-16 h-16 rounded-full border-[3px] border-border-subtle flex items-center justify-center bg-base shadow-inner relative z-10">
                         <span className="text-text-muted font-black text-3xl">?</span>
                      </div>
                    </div>

                    {/* Front of card (Revealed state) */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center p-5 text-center rounded-[24px] border-2 shadow-inner ${card.type === 'question' ? 'bg-blue-500/10 border-blue-500 flex-col gap-2 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-purple-500/10 border-purple-500 flex-col gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]'}`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wide opacity-80 ${card.type === 'question' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
                        {card.type === 'question' ? 'سؤال' : 'إجابة'}
                      </span>
                      <span className={`font-extrabold text-xl leading-snug drop-shadow-sm line-clamp-4 ${card.type === 'question' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
                        {card.content}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};
