import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ConfigObj } from './types';
import { defaultConfig } from './types';
import { db } from './lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface ConfigContextType {
  config: ConfigObj;
  setConfig: React.Dispatch<React.SetStateAction<ConfigObj>>;
  loading: boolean;
  error: string | null;
  pageId?: string;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: React.ReactNode;
  pageId?: string;
  isViewMode?: boolean;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children, pageId, isViewMode }) => {
  const [config, setConfig] = useState<ConfigObj>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load configuration from Firestore
  useEffect(() => {
    async function loadConfig() {
      if (!pageId) {
        // Fallback or demo mode if no pageId is specified
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.config) {
            setConfig(data.config);
          }
        } else {
          setError('الصفحة غير موجودة (404)');
        }
      } catch (err: any) {
        console.error("Error loading config:", err);
        setError('حدث خطأ أثناء تحميل الصفحة');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [pageId]);

  // Debounced Auto-Save to Firestore
  useEffect(() => {
    if (isViewMode || !pageId || loading || error) return;

    const saveTimeout = setTimeout(async () => {
      try {
        const docRef = doc(db, 'pages', pageId);
        await updateDoc(docRef, {
          config: config,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error auto-saving config:", err);
      }
    }, 1000); // 1-second debounce

    return () => clearTimeout(saveTimeout);
  }, [config, pageId, isViewMode, loading, error]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-base flex flex-col items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-electric w-12 h-12 mb-4" />
        <p className="text-white/60">جاري تحميل مساحة العمل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-base flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-6 text-red-500 text-3xl font-bold">!</div>
        <h2 className="text-2xl font-bold text-white mb-2">تعذر الوصول للصفحة</h2>
        <p className="text-white/60 mb-8">{error}</p>
        <a href="/" className="px-6 py-3 bg-electric text-white rounded-xl font-bold shadow-lg hover:shadow-electric/20 hover:-translate-y-1 transition-all">العودة للرئيسية</a>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{ config, setConfig, loading, error, pageId }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
