import React from 'react';
import type { Block } from '../../types';
import { Trophy, Medal, Star } from 'lucide-react';

interface LeaderboardBlockProps {
  block: Block;
}

export const LeaderboardBlock: React.FC<LeaderboardBlockProps> = ({ block }) => {
  // Sort students by score descending
  const students = [...(block.students || [])].sort((a, b) => b.score - a.score);

  if (students.length === 0) {
    return (
      <div className="w-full h-full bg-base flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 border border-border-subtle shadow-sm pb-1">
          <Trophy size={40} className="text-text-muted opacity-50" />
        </div>
        <h3 className="text-2xl font-bold text-text-main mb-2">لوحة المتصدرين فارغة</h3>
        <p className="text-text-muted">لم يقم المعلم بإضافة أي طلاب إلى هذه اللوحة بعد.</p>
      </div>
    );
  }

  const top3 = students.slice(0, 3);
  const rest = students.slice(3);

  // Configuration for top 3 styling
  const config = [
    { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]', icon: <Trophy size={20} className="text-yellow-500 drop-shadow-sm" />, height: 'h-48 md:h-56', rank: 1 },
    { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/50', shadow: 'shadow-[0_0_20px_rgba(148,163,184,0.15)]', icon: <Medal size={20} className="text-slate-400 drop-shadow-sm" />, height: 'h-40 md:h-48', rank: 2 },
    { color: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/50', border: 'border-amber-600/50', shadow: 'shadow-[0_0_20px_rgba(217,119,6,0.15)]', icon: <Medal size={20} className="text-amber-600 drop-shadow-sm" />, height: 'h-36 md:h-40', rank: 3 },
  ];

  // Reorder top 3 for a visual podium layout (2nd, 1st, 3rd)
  const podiumLayout = top3.length === 3 
    ? [top3[1], top3[0], top3[2]] 
    : top3.length === 2 
      ? [top3[1], top3[0]] 
      : [top3[0]];

  return (
    <div className="w-full h-full bg-base overflow-y-auto custom-scrollbar relative pb-16" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 mix-blend-screen rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-electric/10 mix-blend-screen rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-surface border border-border-subtle rounded-2xl mb-6 shadow-sm">
            <Trophy size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-main mb-4 tracking-tight drop-shadow-sm">لوحة الشرف والمتصدرين</h2>
          <p className="text-lg text-text-muted">قائمة بأفضل الطلاب أداءً في هذا القسم</p>
        </div>

        {/* Podium (Top 3) */}
        {podiumLayout.length > 0 && (
          <div className="w-full max-w-2xl flex items-end justify-center gap-2 md:gap-6 mb-16 px-2">
            {podiumLayout.map((student) => {
              // Map back to original rank because podium is visually shuffled
              const actualRank = top3.indexOf(student);
              const style = config[actualRank];
              
              // Only slightly translate Y if it's 2nd or 3rd place to make a literal podium shape
              return (
                <div key={student.id} className="flex-1 flex flex-col items-center animate-in slide-in-from-bottom-[50px] fade-in duration-700" style={{ animationDelay: `${actualRank * 150}ms` }}>
                  {/* Name Tag */}
                  <div className="text-center mb-3">
                    <p className="font-extrabold text-sm md:text-lg text-text-main truncate max-w-[100px] md:max-w-[140px] drop-shadow-sm" title={student.name}>
                      {student.name}
                    </p>
                  </div>
                  
                  {/* Podium Column */}
                  <div className={`w-full ${style.height} ${style.bg} ${style.border} border-t-4 border-l border-r rounded-t-3xl relative flex flex-col items-center justify-start pt-4 md:pt-6 ${style.shadow} backdrop-blur-md transition-transform hover:scale-105 overflow-hidden group`}>
                     {/* Shimmer effect */}
                     <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-base border border-border-subtle flex items-center justify-center mb-2 shadow-sm z-10 pb-1">
                       {style.icon}
                     </div>
                     <span className={`text-2xl md:text-4xl font-black ${style.color} drop-shadow-md z-10`}>
                       {student.score}
                     </span>
                     <span className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-widest mt-1 z-10">نقطة</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest of the List (4th+) */}
        {rest.length > 0 && (
          <div className="w-full max-w-2xl bg-surface border border-border-subtle rounded-[32px] p-2 shadow-sm animate-in fade-in duration-1000 delay-300">
            {rest.map((student, index) => (
              <div 
                key={student.id} 
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-base/50 transition-colors ${index !== rest.length - 1 ? 'border-b border-border-subtle/50 rounded-b-none' : ''}`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-base border border-border-subtle text-text-muted font-black shadow-sm pb-1 shrink-0">
                    {index + 4}
                  </div>
                  <p className="font-bold text-base md:text-xl text-text-main drop-shadow-sm">{student.name}</p>
                </div>
                <div className="flex items-center gap-2 bg-base px-4 py-2 border border-border-subtle rounded-xl shadow-sm">
                  <Star size={16} className="text-yellow-500 fill-yellow-500/20" />
                  <span className="font-black text-text-main">{student.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
