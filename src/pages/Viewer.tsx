import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConfigProvider } from '../ConfigContext';
import { Preview } from '../components/Preview';
import { ThemeToggle } from '../components/ThemeToggle';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export function Viewer() {
  const { slug } = useParams<{ slug: string }>();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveSlug() {
      if (!slug) {
        setError('الصفحة غير موجودة');
        return;
      }
      
      try {
        const q = query(collection(db, 'pages'), where('slug', '==', slug), where('isPublished', '==', true));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setResolvedId(querySnapshot.docs[0].id);
        } else {
          setError('هذه الصفحة غير موجودة، قد يكون الرابط خاطئاً أو لم يتم نشرها بعد.');
        }
      } catch (err) {
        console.error("Error resolving slug:", err);
        setError('حدث خطأ أثناء تحميل الصفحة');
      }
    }

    resolveSlug();
  }, [slug]);

  if (error) {
    return (
      <div className="w-full h-screen bg-base flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-6 text-red-500 text-3xl font-bold">!</div>
        <h2 className="text-2xl font-bold text-text-main mb-2">تعذر الوصول</h2>
        <p className="text-text-muted mb-8">{error}</p>
        <a href="/" className="px-6 py-3 bg-electric text-white rounded-xl font-bold shadow-lg hover:shadow-electric/20 hover:-translate-y-1 transition-all">الرئيسية</a>
      </div>
    );
  }

  if (!resolvedId) {
    return (
      <div className="w-full h-screen bg-base flex flex-col items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-electric w-12 h-12 mb-4" />
        <p className="text-white/60">جاري تحميل الصفحة...</p>
      </div>
    );
  }

  return (
    <ConfigProvider pageId={resolvedId} isViewMode={true}>
      <div className="w-full h-screen bg-base text-text-main flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-6 right-6 z-50 bg-surface/80 backdrop-blur-md rounded-2xl shadow-lg border border-border-subtle hover:scale-105 transition-transform">
           <ThemeToggle />
        </div>
        <Preview isViewMode={true} />
      </div>
    </ConfigProvider>
  );
}
