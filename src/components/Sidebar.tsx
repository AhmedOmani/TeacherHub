import React from 'react';
import { UserCircle, LayoutGrid, Palette, Send } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type TabType = 'hero' | 'sections' | 'appearance' | 'publishing' | null;

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

const navItems = [
  { id: 'hero', label: 'الصفحة الرئيسية', icon: UserCircle },
  { id: 'sections', label: 'الاقسام', icon: LayoutGrid },
  { id: 'appearance', label: 'المظهر', icon: Palette },
  { id: 'publishing', label: 'النشر', icon: Send },

] as const;

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-64 bg-surface backdrop-blur-3xl border-l border-border-subtle p-6 flex flex-col h-full z-40 shrink-0 shadow-2xl">
      <div className="mb-10 flex items-center gap-3">
         <div className="w-8 h-8 rounded-lg outline-none bg-electric flex items-center justify-center text-white font-bold">
           TH
         </div>
         <h1 className="text-xl font-bold tracking-tight text-text-main">Teacher<span className="text-electric">Hub</span></h1>
      </div>
      
      <nav className="flex flex-col gap-2 w-full flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(isActive ? null : item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-right ${
                isActive 
                  ? 'bg-electric/15 text-electric border border-electric/30' 
                  : 'text-text-muted hover:text-text-main hover:bg-border-subtle border border-transparent'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-electric' : 'text-text-muted opacity-70'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <div className="w-8 h-8 rounded-full bg-border-subtle overflow-hidden flex items-center justify-center">
            <UserCircle size={20} />
          </div>
          <div>
            <p className="text-text-main font-medium">أستاذ أحمد</p>
            <p className="text-xs">مسؤول النظام</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
};
