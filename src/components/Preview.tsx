import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import { Video, Link as LinkIcon, FormInput, MonitorPlay, Film, X, ExternalLink } from 'lucide-react';
import type { Block } from '../types';

export const Preview: React.FC<{ isViewMode?: boolean }> = ({ isViewMode = false }) => {
  const { config } = useConfig();
  const showOrbs = config.appearance?.showGradientOrbs ?? true;
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Video className="text-red-500" size={24} />;
      case 'google-form': return <FormInput className="text-emerald-500" size={24} />;
      case 'canva': return <MonitorPlay className="text-purple-400" size={24} />;
      case 'video': return <Film className="text-orange-500" size={24} />;
      default: return <LinkIcon className="text-blue-400" size={24} />;
    }
  };

  return (
    <div className={`flex-1 shrink-0 bg-transparent overflow-hidden w-full flex text-text-main relative`}>
      {/* Background image layer */}
      {config.appearance?.backgroundUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20 transition-all duration-1000"
          style={{ backgroundImage: `url(${config.appearance.backgroundUrl})` }}
        />
      )}
      
      {/* Canva-inspired floating orbs that work in Light & Dark */}
      {showOrbs && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top Left Orb */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-electric opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen rounded-[100%] blur-[100px] animate-pulse" />
          {/* Middle Right Orb */}
          <div className="absolute top-[30%] right-[-10%] w-[400px] h-[600px] bg-purple-500 opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen rounded-[100%] blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Bottom Left Orb */}
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[500px] bg-blue-500 opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen rounded-[100%] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      <div className={`relative z-10 w-full h-full overflow-y-auto custom-scrollbar ${isViewMode ? 'p-6 md:p-12 flex justify-center items-start' : 'p-12 md:pr-16 md:pl-24 flex justify-start'}`}>
        <div className={`w-full pb-24 ${isViewMode ? 'max-w-4xl' : 'max-w-[1400px]'}`}>
          {/* ... Hero omitted ... */}
          <div className="flex flex-col items-center text-center space-y-6 mb-20 mt-12 relative p-12">
            <div className="absolute inset-0 bg-surface/30 backdrop-blur-xl rounded-[64px] border border-border-subtle shadow-sm -z-10" />
            {config.hero.avatar ? (
              <img 
                src={config.hero.avatar} 
                alt="Avatar" 
                style={{ objectPosition: config.hero.avatarPosition || 'center' }}
                className="w-32 h-32 rounded-full object-cover border-[4px] border-surface drop-shadow-xl relative z-10 hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-[4px] border-surface bg-base flex items-center justify-center text-text-muted relative z-10 drop-shadow-xl">صورة</div>
            )}
            
            <div className="space-y-2 relative z-10 pt-4">
              <h1 className="text-5xl font-bold tracking-tight drop-shadow-sm">{config.hero.title || 'أضف عنوان'}</h1>
              <p className="text-text-muted text-xl max-w-2xl leading-relaxed">{config.hero.subtitle || 'أضف نبذة هنا'}</p>
            </div>
          </div>

          {/* Sections & Blocks */}
          <div className="space-y-16">
            {config.sections.map(section => (
              <div key={section.id} className="space-y-8 relative">
                
                <div className="relative inline-block w-full text-center mb-4">
                  <div className="inline-flex items-center gap-4 px-8 py-3 rounded-2xl relative z-10">
                    <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: section.badgeColor || 'var(--text-main)' }}>
                       {section.badgeName && <span className="mr-3 opacity-90">{section.badgeName}</span>}
                       {section.title || 'مقطع بدون عنوان'}
                       {section.badgeName && <span className="ml-3 opacity-90">{section.badgeName}</span>}
                    </h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.blocks.length === 0 && (
                     <div className="col-span-full py-12 bg-surface/50 backdrop-blur-md border border-dashed border-border-subtle rounded-[32px] text-center text-text-muted text-sm flex flex-col items-center justify-center gap-2">
                        لا يوجد محتوى في هذا المقطع.
                     </div>
                  )}
                  
                  {section.blocks.map(block => (
                     <a 
                        key={block.id} 
                        href={block.url || '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (block.type === 'youtube' || block.type === 'video') {
                            e.preventDefault();
                            if (block.url) setActiveBlock(block);
                          }
                        }}
                        className="bg-surface/90 backdrop-blur-xl border-t border-r border-l border-b-[8px] rounded-[24px] px-8 py-6 hover:translate-y-[2px] hover:border-b-[6px] active:translate-y-[6px] active:border-b-[2px] transition-all duration-150 cursor-pointer group flex items-center justify-between relative overflow-hidden"
                        style={{ borderBottomColor: block.borderColor || '#F472B6', borderTopColor: 'var(--border-subtle)', borderRightColor: 'var(--border-subtle)', borderLeftColor: 'var(--border-subtle)' }}
                     >
                        <div className="flex-1 text-right">
                          <h3 className="text-2xl font-bold mb-1 text-text-main group-hover:opacity-80 transition-opacity">{block.title || 'رابط جديد'}</h3>
                          <p className="text-sm font-medium" style={{ color: block.borderColor || '#64748b' }}>
                            اضغط للعب 🎮
                          </p>
                        </div>
                        
                        {block.emoji ? (
                          <div className="text-5xl shrink-0 drop-shadow-md group-hover:scale-110 transition-transform origin-center mr-4">
                            {block.emoji}
                          </div>
                        ) : (
                          <div className="relative z-10 h-14 w-14 rounded-2xl bg-base border border-border-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm shrink-0 mr-4">
                            {getIcon(block.type)}
                          </div>
                        )}
                     </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay Modal for In-Page Rendering */}
      {activeBlock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-200" dir="rtl">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setActiveBlock(null)} />
          
          <div className="relative w-full h-full max-w-6xl max-h-[800px] flex flex-col bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-base/80 backdrop-blur-md">
              <h3 className="text-xl font-bold text-text-main flex items-center gap-3">
                {activeBlock.emoji ? <span>{activeBlock.emoji}</span> : getIcon(activeBlock.type)}
                {activeBlock.title || 'عرض المحتوى'}
              </h3>
              <div className="flex items-center gap-3">
                <a 
                  href={activeBlock.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-base hover:bg-border-subtle text-text-muted hover:text-text-main transition-colors flex items-center gap-2 text-sm font-medium"
                  title="فتح في نافذة جديدة"
                >
                  <ExternalLink size={18} />
                  <span>فتح في متصفح جديد</span>
                </a>
                <button 
                  onClick={() => setActiveBlock(null)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 bg-black relative">
              {activeBlock.type === 'youtube' ? (() => {
                let videoId = '';
                if (activeBlock.url.includes('v=')) videoId = activeBlock.url.split('v=')[1]?.split('&')[0];
                else if (activeBlock.url.includes('youtu.be/')) videoId = activeBlock.url.split('youtu.be/')[1]?.split('?')[0];
                
                const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : activeBlock.url;
                return <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; encrypted-media" />;
              })() : activeBlock.type === 'video' ? (
                <video src={activeBlock.url} controls autoPlay className="w-full h-full object-contain" />
              ) : activeBlock.type === 'google-form' ? (
                <iframe src={activeBlock.url.includes('?') ? `${activeBlock.url}&embedded=true` : `${activeBlock.url}?embedded=true`} className="w-full h-full border-0 bg-white" allowFullScreen />
              ) : (
                <iframe src={activeBlock.url} className="w-full h-full border-0 bg-white" allowFullScreen />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
