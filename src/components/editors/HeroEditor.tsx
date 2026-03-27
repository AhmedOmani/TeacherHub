import React from 'react';
import { useConfig } from '../../ConfigContext';
import { Input } from '../ui/Input';
import { FileUpload } from '../ui/FileUpload';

export const HeroEditor: React.FC = () => {
  const { config, setConfig } = useConfig();

  const handleChange = (field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <Input
        label="عنوان الصفحة (Title)"
        value={config.hero.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="مثال: أستاذ أحمد"
      />
      <Input
        label="نبذة أو وصف (Subtitle)"
        value={config.hero.subtitle}
        onChange={(e) => handleChange('subtitle', e.target.value)}
        placeholder="مرحباً بكم في منصة التعليم..."
      />
      <FileUpload
        label="الصورة الشخصية (Avatar)"
        value={config.hero.avatar}
        onChange={(url) => handleChange('avatar', url)}
      />
      
      {config.hero.avatar && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted select-none">موضع عرض الصورة</label>
          <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border-subtle overflow-hidden">
            {['top', 'center', 'bottom'].map((pos) => {
              const isActive = config.hero.avatarPosition === pos || (!config.hero.avatarPosition && pos === 'center');
              return (
                <button
                  key={pos}
                  onClick={() => handleChange('avatarPosition', pos)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive 
                      ? 'bg-electric text-white shadow-md' 
                      : 'text-text-muted hover:text-text-main hover:bg-white/5'
                  }`}
                >
                  {pos === 'top' ? 'أعلى' : pos === 'center' ? 'وسط' : 'أسفل'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
