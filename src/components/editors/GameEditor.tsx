import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Gamepad2, Settings2 } from 'lucide-react';
import type { GamePair, GameMode } from '../../types';

interface GameEditorProps {
  initialPairs?: GamePair[];
  initialMode?: GameMode;
  onSave: (pairs: GamePair[], mode: GameMode) => void;
  onClose: () => void;
}

export const GameEditor: React.FC<GameEditorProps> = ({ initialPairs = [], initialMode = 'flashcards', onSave, onClose }) => {
  const [pairs, setPairs] = useState<GamePair[]>(initialPairs.length > 0 ? initialPairs : [{ id: crypto.randomUUID(), question: '', answer: '' }]);
  const [mode, setMode] = useState<GameMode>(initialMode);

  const addPair = () => {
    setPairs([...pairs, { id: crypto.randomUUID(), question: '', answer: '' }]);
  };

  const updatePair = (id: string, field: 'question' | 'answer', value: string) => {
    setPairs(pairs.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePair = (id: string) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    // Filter out empty pairs
    const validPairs = pairs.filter(p => p.question.trim() || p.answer.trim());
    if (validPairs.length === 0) {
      // Create at least one dummy pair so it doesn't break
      onSave([{ id: crypto.randomUUID(), question: 'سؤال افتراضي', answer: 'جواب افتراضي' }], mode);
    } else {
      onSave(validPairs, mode);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-base/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface border border-border-subtle rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]" dir="rtl">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-electric/20 flex items-center justify-center shadow-inner">
              <Gamepad2 className="text-electric" size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-main">إعدادات اللعبة التفاعلية</h2>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-slate-900 dark:hover:text-white bg-base hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors z-10">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 bg-base p-4 rounded-2xl border border-border-subtle flex items-center gap-4 relative z-10">
          <Settings2 size={24} className="text-electric" />
          <div className="flex-1">
            <label className="text-sm font-bold text-text-main block mb-1">نوع اللعبة</label>
            <p className="text-xs text-text-muted mb-2">اختر الطريقة التي تريد أن يختبر بها الطلاب معلوماتهم</p>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as GameMode)}
              className="w-full bg-surface border border-border-subtle outline-none text-text-main font-medium rounded-xl px-4 py-3 text-sm focus:border-electric transition-colors"
            >
              <option className="bg-surface text-text-main" value="flashcards">📇 البطاقات التعليمية السريعة (Flashcards)</option>
              <option className="bg-surface text-text-main" value="memory">🃏 لعبة الذاكرة وتطابق الصور (Memory Match)</option>
              <option className="bg-surface text-text-main" value="match">🔗 لعبة التوصيل (Connect Match)</option>
              <option className="bg-surface text-text-main" value="sort">📥 لعبة التصنيف (Sorting Game)</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 p-1 mb-6 custom-scrollbar relative z-10">
          <p className="text-sm font-bold text-text-main mb-2">قائمة الكلمات أو الأسئلة</p>
           {pairs.map((pair, index) => (
             <div key={pair.id} className="flex items-center gap-3 bg-base p-3 rounded-2xl border border-border-subtle hover:border-border-muted transition-colors group">
               <span className="text-sm font-bold w-6 h-6 rounded-full bg-surface flex items-center justify-center text-text-muted">{index + 1}</span>
               
               <div className="flex-1 flex gap-2">
                 <input
                   type="text"
                   placeholder="السؤال / الكلمة (مثال: ما عاصمة مصر؟)"
                   value={pair.question}
                   onChange={(e) => updatePair(pair.id, 'question', e.target.value)}
                   className="flex-1 bg-surface border border-border-subtle focus:border-electric rounded-xl px-4 py-2.5 text-text-main text-sm outline-none transition-all placeholder:text-text-muted/50"
                 />
                 <input
                   type="text"
                   placeholder="الجواب / المرادف (مثال: القاهرة)"
                   value={pair.answer}
                   onChange={(e) => updatePair(pair.id, 'answer', e.target.value)}
                   className="flex-1 bg-surface border border-border-subtle focus:border-electric rounded-xl px-4 py-2.5 text-text-main text-sm outline-none transition-all placeholder:text-text-muted/50"
                 />
               </div>

               <button 
                 onClick={() => removePair(pair.id)} 
                 disabled={pairs.length === 1} 
                 className="p-2.5 text-text-muted hover:text-red-500 bg-surface hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-text-muted"
                 title="حذف البطاقة"
               >
                 <Trash2 size={18} />
               </button>
             </div>
           ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-subtle relative z-10">
          <button onClick={addPair} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-electric bg-electric/10 hover:bg-electric/20 rounded-xl transition-colors">
            <Plus size={18} strokeWidth={3} /> إضافة بطاقة أخرى
          </button>
          
          <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-electric text-white font-bold rounded-xl hover:shadow-lg hover:shadow-electric/25 hover:-translate-y-0.5 transition-all outline-none">
            <Save size={18} /> حفظ وإدراج اللعبة
          </button>
        </div>
      </div>
    </div>
  );
};
