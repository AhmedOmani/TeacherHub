import React from 'react';
import { useConfig } from '../../ConfigContext';
import { Input } from '../ui/Input';
import { Plus, Trash2, Link, PlaySquare, FileText, Palette, ChevronDown, Film, Crown, Lock } from 'lucide-react';
import type { Section, Block, BlockType } from '../../types';
import { FileUpload } from '../ui/FileUpload';
import { EmojiPicker } from '../ui/EmojiPicker';
import { useAuth } from '../../AuthContext';

const BlockTypeSelector = ({ value, onChange }: { value: string, onChange: (v: BlockType) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { subscriptionStatus } = useAuth();
  const isPro = subscriptionStatus === 'pro';

  const types = [
    { id: 'link', icon: Link, label: 'رابط عادي', color: 'text-blue-400' },
    { id: 'youtube', icon: PlaySquare, label: 'يوتيوب', color: 'text-red-500' },
    { id: 'google-form', icon: FileText, label: 'نموذج جوجل', color: 'text-emerald-500' },
    { id: 'canva', icon: Palette, label: 'تصميم كانفا', color: 'text-purple-400' },
    { id: 'video', icon: Film, label: 'فيديو خاص', color: 'text-orange-500', isPremium: true },
    { id: 'document', icon: FileText, label: 'ملف (PPTX/DOCX/PDF)', color: 'text-cyan-400', isPremium: true },
  ];
  
  const selected = types.find(t => t.id === value) || types[0];
  const SelectedIcon = selected.icon;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base border border-border-subtle hover:border-border-muted transition-colors text-sm"
      >
        <SelectedIcon size={16} className={selected.color} />
        <span className="text-text-main font-medium">{selected.label}</span>
        <ChevronDown size={14} className="text-text-muted ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 min-w-[220px] bg-base border border-border-subtle rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
            {types.map(type => {
              const Icon = type.icon;
              const disabled = type.isPremium && !isPro;
              return (
                <button
                  key={type.id}
                  onClick={() => { 
                    if (!disabled) {
                      onChange(type.id as BlockType); 
                      setIsOpen(false); 
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors group relative ${value === type.id ? 'bg-base/50' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-base cursor-pointer'}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={type.color} />
                    <span className="text-text-main">{type.label}</span>
                  </div>
                  {type.isPremium && (
                    <div className="flex items-center">
                      {isPro ? <Crown size={12} className="text-electric/50" /> : <Lock size={12} className="text-text-muted" />}
                    </div>
                  )}
                  {disabled && (
                    <div className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-[200px] p-3 bg-base border border-border-subtle rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-center z-50 pointer-events-none">
                       <p className="text-xs font-bold text-electric mb-1 flex items-center justify-center gap-1"><Crown size={12}/> ميزة PRO</p>
                       <p className="text-[10px] text-text-muted leading-tight">الرفع المباشر (S3) متاح في الباقة المدفوعة.</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  );
};

export const SectionsEditor: React.FC = () => {
  const { config, setConfig } = useConfig();

  const addSection = () => {
    const newSection: Section = { id: `sec-${Date.now()}`, title: 'قسم جديد', blocks: [] };
    setConfig((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const updateSectionTitle = (id: string, newTitle: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    }));
  };

  const updateSectionBadge = (id: string, field: 'badgeName' | 'badgeColor', value: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const removeSection = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const addBlock = (sectionId: string, type: BlockType = 'link') => {
    const newBlock: Block = { id: `blk-${Date.now()}`, type, title: 'رابط جديد', url: '' };
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s
      )
    }));
  };

  const updateBlock = (sectionId: string, blockId: string, field: keyof Block, value: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? {
          ...s,
          blocks: s.blocks.map(b => b.id === blockId ? { ...b, [field]: value } : b)
        } : s
      )
    }));
  };

  const removeBlock = (sectionId: string, blockId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? {
          ...s,
          blocks: s.blocks.filter(b => b.id !== blockId)
        } : s
      )
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {config.sections.map((section) => (
        <div key={section.id} className="p-4 bg-base border border-border-subtle rounded-2xl relative group">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-text-main font-medium">خصائص هذا القسم</h3>
            <button 
              onClick={() => removeSection(section.id)}
              className="text-text-muted hover:text-red-500 transition-colors"
              title="حذف القسم"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <Input
            label="اسم القسم"
            value={section.title}
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            placeholder="مثال: الرياضيات البحتة"
            className="mb-0"
          />

          <div className="grid grid-cols-2 gap-4 mt-2">
            <Input
              label="علامة مميزة (اختياري)"
              value={section.badgeName || ''}
              onChange={(e) => updateSectionBadge(section.id, 'badgeName', e.target.value)}
              placeholder="مثال: هام جداً"
              className="mb-0 text-sm"
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-muted">لون العلامة</label>
              <div className="flex items-center gap-3 h-[46px] px-3 border border-border-subtle rounded-xl bg-base hover:border-electric transition-colors cursor-pointer relative">
                <input 
                  type="color" 
                  value={section.badgeColor || '#8B5CF6'} 
                  onChange={(e) => updateSectionBadge(section.id, 'badgeColor', e.target.value)}
                  className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-6 h-6 rounded-full border border-border-subtle shadow-sm pointer-events-none" style={{ backgroundColor: section.badgeColor || '#8B5CF6' }} />
                <span className="text-sm text-text-main font-mono pointer-events-none" dir="ltr">{section.badgeColor || '#8B5CF6'}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border-subtle space-y-3">
            <p className="text-xs text-text-muted mb-2">المحتوى ({section.blocks.length} عناصر)</p>
            
            {section.blocks.map(block => (
              <div key={block.id} className="p-3 rounded-xl bg-surface border border-border-subtle space-y-3">
                <div className="flex justify-between items-center">
                  <BlockTypeSelector 
                    value={block.type}
                    onChange={(newVal) => updateBlock(section.id, block.id, 'type', newVal)}
                  />
                  <button onClick={() => removeBlock(section.id, block.id)} className="text-text-muted hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <Input
                  label="عنوان المحتوى"
                  value={block.title}
                  onChange={(e) => updateBlock(section.id, block.id, 'title', e.target.value)}
                  className="mb-0"
                />
                
                
                {block.type === 'video' || block.type === 'document' ? (
                  <FileUpload 
                    label={block.type === 'video' ? 'ملف الفيديو (S3)' : 'ارفع الملف (PPTX, DOCX, PDF) - أقصى حد 10 ميجا'}
                    value={block.url}
                    onChange={(url) => updateBlock(section.id, block.id, 'url', url)}
                    accept={block.type === 'video' ? 'video/*' : '.pdf,.doc,.docx,.ppt,.pptx'}
                  />
                ) : (
                  <Input
                    label="الرابط (URL)"
                    value={block.url}
                    onChange={(e) => updateBlock(section.id, block.id, 'url', e.target.value)}
                    dir="ltr"
                    className="text-left mb-0"
                  />
                )}
                <div className="flex gap-3 mt-2 relative">
                  <EmojiPicker
                    label="رمز (Emoji)"
                    value={block.emoji || ''}
                    onChange={(emoji) => updateBlock(section.id, block.id, 'emoji', emoji)}
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-muted">لون الإطار البارز</label>
                    <div className="flex items-center gap-3 h-[46px] px-3 border border-border-subtle rounded-xl bg-base hover:border-electric transition-colors cursor-pointer relative">
                      <input 
                        type="color" 
                        value={block.borderColor || '#F472B6'} 
                        onChange={(e) => updateBlock(section.id, block.id, 'borderColor', e.target.value)}
                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-5 h-5 rounded-full border border-border-subtle shadow-sm pointer-events-none" style={{ backgroundColor: block.borderColor || '#F472B6' }} />
                      <span className="text-xs text-text-main font-mono pointer-events-none" dir="ltr">{block.borderColor || '#F472B6'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => addBlock(section.id)} className="w-full py-2 border border-dashed border-border-subtle rounded-xl text-sm text-text-muted hover:text-text-main hover:border-text-muted transition-colors flex justify-center items-center gap-2">
              <Plus size={16} /> إضافة محتوى جديد
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={addSection}
        className="w-full py-3 bg-electric/10 text-electric hover:bg-electric/20 font-medium rounded-xl transition-colors flex justify-center items-center gap-2"
      >
        <Plus size={18} /> قسم جديد
      </button>
    </div>
  );
};
