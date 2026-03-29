import type { Block } from '../../types';
import { Flashcards } from '../games/Flashcards';
import { MemoryMatch } from '../games/MemoryMatch';
import { ConnectMatch } from '../games/ConnectMatch';
import { SortingGame } from '../games/SortingGame';

interface GameBlockProps {
  block: Block;
}

export const GameBlock: React.FC<GameBlockProps> = ({ block }) => {
  const mode = block.gameType || 'flashcards';
  const pairs = block.gamePairs || [];

  if (pairs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base p-8 text-center text-text-muted h-full rounded-2xl w-full">
        <p className="text-xl font-bold mb-2">البيانات غير متوفرة ⚠️</p>
        <p className="text-sm">يرجى من المعلم إضافة أسئلة للبدء في تشغيل هذه اللعبة التفاعلية.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-base overflow-y-auto overflow-x-hidden relative custom-scrollbar">
      <div className="absolute inset-0 bg-electric/5 pointer-events-none" />
      {mode === 'flashcards' && <Flashcards pairs={pairs} />}
      {mode === 'memory' && <MemoryMatch pairs={pairs} />}
      {mode === 'match' && <ConnectMatch pairs={pairs} />}
      {mode === 'sort' && <SortingGame pairs={pairs} />}
    </div>
  );
};
