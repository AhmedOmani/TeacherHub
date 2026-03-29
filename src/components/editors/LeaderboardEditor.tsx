import React, { useState } from 'react';
import type { Block, LeaderboardStudent } from '../../types';
import { Trophy, Plus, Trash2, X, AlertCircle } from 'lucide-react';

interface LeaderboardEditorProps {
  block: Block;
  onSave: (updates: Partial<Block>) => void;
  onClose: () => void;
}

export const LeaderboardEditor: React.FC<LeaderboardEditorProps> = ({ block, onSave, onClose }) => {
  const [students, setStudents] = useState<LeaderboardStudent[]>(block.students || []);

  const addStudent = () => {
    setStudents([...students, { id: crypto.randomUUID(), name: '', score: 0 }]);
  };

  const updateStudent = (id: string, field: keyof LeaderboardStudent, value: any) => {
    setStudents(students.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateScore = (id: string, amount: number) => {
    setStudents(students.map(s => s.id === id ? { ...s, score: Math.max(0, s.score + amount) } : s));
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const save = () => {
    // Filter out empties and strictly sort by standard desc ranking
    const validStudents = students.filter(s => s.name.trim() !== '');
    
    // Auto-sort Descending on save
    const sortedStudents = validStudents.sort((a, b) => b.score - a.score);

    onSave({ students: sortedStudents });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 md:p-8 animate-in fade-in duration-200" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-base">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">إدارة لوحة المتصدرين</h2>
              <p className="text-sm text-text-muted">أضف الطلاب وعدّل نقاطهم لتشجيع التنافس</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-main">قائمة الطلاب ({students.length})</h3>
            <button 
              onClick={addStudent}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={16} /> إضافة طالب
            </button>
          </div>

          <div className="space-y-3">
            {students.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center bg-base border border-dashed border-border-subtle rounded-2xl">
                <Trophy size={48} className="text-border-subtle mb-4" />
                <p className="text-text-muted font-medium">لم تقم بإضافة أي طالب بعد</p>
                <button onClick={addStudent} className="mt-4 text-yellow-500 font-bold hover:underline">أضف أول طالب</button>
              </div>
            ) : (
              students.map((student, index) => (
                <div key={student.id} className="flex flex-col md:flex-row md:items-center gap-3 bg-base border border-border-subtle p-3 rounded-2xl shadow-sm focus-within:border-yellow-500 transition-colors">
                  
                  {/* Rank Display (Visual only) */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface text-text-muted font-bold text-sm shrink-0">
                    {index + 1}
                  </div>

                  {/* Name Input */}
                  <div className="flex-1">
                    <input 
                      type="text"
                      value={student.name}
                      onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                      placeholder="اسم الطالب (مثال: أحمد محمد)"
                      className="w-full bg-transparent border-none outline-none text-text-main font-bold placeholder:text-text-muted/50 px-2"
                    />
                  </div>
                  
                  {/* Score Controls */}
                  <div className="flex items-center gap-2 shrink-0 md:ml-4 bg-surface p-1 rounded-xl">
                    <button 
                      onClick={() => updateScore(student.id, -1)}
                      className="w-8 h-8 rounded-lg bg-base border border-border-subtle flex items-center justify-center hover:text-red-500 transition-colors text-text-muted font-bold"
                    >-</button>
                    <div className="w-12 text-center font-black text-yellow-500 text-lg">
                      {student.score}
                    </div>
                    <button 
                      onClick={() => updateScore(student.id, 1)}
                      className="w-8 h-8 rounded-lg bg-base border border-border-subtle flex items-center justify-center hover:text-emerald-500 transition-colors text-text-muted font-bold"
                    >+</button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="p-3 text-border-subtle hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 text-blue-500 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>سيتم حفظ القائمة وترتيب الطلاب تلقائياً من الأعلى إلى الأقل نقاطاً عند الحفظ.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-base flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-text-main bg-surface hover:bg-border-subtle transition-colors border border-border-subtle"
          >
            إلغاء
          </button>
          <button 
            onClick={save}
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 shadow-md hover:shadow-yellow-500/20 transition-all"
          >
            حفظ المتصدرين
          </button>
        </div>
      </div>
    </div>
  );
};
