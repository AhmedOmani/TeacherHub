import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    // Default to dark mode
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="p-3 rounded-xl hover:bg-border-subtle transition-colors text-text-muted hover:text-text-main flex items-center justify-center"
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
