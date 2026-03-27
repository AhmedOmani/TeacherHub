import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TabType } from './Sidebar';
import { HeroEditor } from './editors/HeroEditor';
import { SectionsEditor } from './editors/SectionsEditor';
import { PublishEditor } from './editors/PublishEditor';
import { AppearanceEditor } from './editors/AppearanceEditor';

interface OverlayProps {
  activeTab: TabType;
  onClose: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ activeTab, onClose }) => {
  return (
    <AnimatePresence>
      {activeTab && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-64 top-0 bottom-0 w-[600px] bg-surface/90 backdrop-blur-3xl border-l border-border-subtle p-8 shadow-2xl z-50 flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-text-main">
              {activeTab === 'hero' && 'الصفحة الرئيسية'}
              {activeTab === 'sections' && 'إدارة المقاطع والدروس'}
              {activeTab === 'appearance' && 'تخصيص المظهر'}
              {activeTab === 'publishing' && 'خيارات النشر'}
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-border-subtle">
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar pr-2">
             {activeTab === 'hero' && <HeroEditor />}
             {activeTab === 'sections' && <SectionsEditor />}
             {activeTab === 'appearance' && <AppearanceEditor />}
             {activeTab === 'publishing' && <PublishEditor />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
