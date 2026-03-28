import React from 'react';
import { useConfig } from '../../ConfigContext';
import { FileUpload } from '../ui/FileUpload';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export const AppearanceEditor: React.FC = () => {
  const { config, setConfig } = useConfig();

  const handleAppearanceChange = (field: 'backgroundUrl' | 'showGradientOrbs', value: any) => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...(prev.appearance || {}),
        [field]: value
      }
    }));
  };

  const showOrbs = config.appearance?.showGradientOrbs ?? true;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-electric/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-electric/30">
          <Sparkles className="text-electric" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-text-main">تخصيص المظهر</h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
          اضبط خلفية الموقع وأضف لمسات جمالية لجعله يبدو أكثر احترافية وجاذبية لطلابك.
        </p>
      </div>

      <div className="p-4 bg-base border border-border-subtle rounded-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-border-subtle pb-4 mb-4">
          <ImageIcon className="text-electric" size={20} />
          <h3 className="font-semibold text-text-main text-lg">الخلفية والمؤثرات</h3>
        </div>

        <FileUpload
          label="صورة الخلفية (اختياري)"
          value={config.appearance?.backgroundUrl || ''}
          onChange={(url) => handleAppearanceChange('backgroundUrl', url)}
          isPremium={true}
        />

        <div className="flex items-center justify-between p-4 bg-surface border border-border-subtle rounded-xl cursor-pointer hover:border-electric/50 transition-colors"
             onClick={() => handleAppearanceChange('showGradientOrbs', !showOrbs)}>
          <div>
            <p className="font-medium text-text-main text-sm">أضواء الخلفية المتحركة (Orbs)</p>
            <p className="text-xs text-text-muted mt-1">إضافة تموجات لونية متحركة في الخلفية</p>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${showOrbs ? 'bg-electric' : 'bg-border-subtle'}`}>
             <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showOrbs ? 'translate-x-0' : '-translate-x-6'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
