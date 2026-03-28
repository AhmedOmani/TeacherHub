import React, { useState, useRef, useEffect } from 'react';
import { SmilePlus, Crown, Lock } from 'lucide-react';
import { useAuth } from '../../AuthContext';

const COMMON_EMOJIS = [
  '📚', '📖', '📝', '✏️', '🎓', '🏆', '⭐', '💡',
  '🔍', '🔬', '💻', '🎬', '🎧', '🎯', '🧩', '🎨',
  '⚽', '🚀', '🌟', '🔥', '✨', '✅', '👋', '👍',
  '💪', '🧠', '🗣️', '🌍', '📊', '📈', '💼', '📌'
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ value, onChange, label = 'رمز' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { subscriptionStatus } = useAuth();
  const isPro = subscriptionStatus === 'pro';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-medium text-text-muted">{label}</label>
      <button
        type="button"
        onMouseEnter={() => { if (!isPro) setIsOpen(false); }}
        onClick={() => {
          if (isPro) setIsOpen(!isOpen);
        }}
        className={`h-[46px] w-[60px] flex items-center justify-center bg-base border border-border-subtle rounded-xl transition-colors text-2xl group relative ${isPro ? 'hover:border-electric cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
      >
        {value || <SmilePlus size={20} className={`text-text-muted transition-colors ${isPro ? 'group-hover:text-electric' : ''}`} />}
        {!isPro && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-surface border border-border-subtle rounded-full flex items-center justify-center shadow-sm">
            <Lock size={10} className="text-text-muted" />
          </div>
        )}
      </button>

      {/* Tooltip for free users */}
      {!isPro && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] p-3 bg-surface border border-border-subtle rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-center z-50 pointer-events-none">
          <p className="text-xs font-bold text-electric mb-1 flex items-center justify-center gap-1"><Crown size={12}/> ميزة PRO</p>
          <p className="text-[10px] text-text-muted leading-tight">قم بالترقية لاستخدام مكتبة الرموز التعبيرية المميزة في موقعك.</p>
        </div>
      )}

      {isOpen && isPro && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[280px] bg-base border border-border-subtle rounded-xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-medium text-text-muted">اختر رمزاً</span>
            <span className="text-[10px] text-electric uppercase font-bold tracking-wider px-2 py-0.5 rounded flex items-center gap-1 bg-electric/10">
              <Crown size={10} /> Pro
            </span>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onChange(emoji);
                  setIsOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-electric/20 rounded-lg text-xl transition-colors hover:scale-110 active:scale-95 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
