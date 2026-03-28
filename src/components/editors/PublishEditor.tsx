import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Copy, ExternalLink, CheckCircle2, Loader2, AlertCircle, Dices } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { formatSlug } from '../../utils/validators';

export const PublishEditor: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [slug, setSlug] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!pageId) return;
    getDoc(doc(db, 'pages', pageId)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSlug(data.slug || pageId);
        setPublished(data.isPublished || false);
      }
      setInitialLoading(false);
    });
  }, [pageId]);

  // Debounced Slug Validation
  useEffect(() => {
    if (!slug || initialLoading || !pageId) return;

    // Basic format check (alphanumeric and dashes only, case-insensitive)
    if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
      setSlugError('الرابط يجب أن يحتوي على أحرف إنجليزية، أرقام، وشرطات (-) فقط.');
      return;
    }

    const checkSlug = async () => {
      setIsCheckingSlug(true);
      setSlugError(null);
      try {
        const q = query(collection(db, 'pages'), where('slug', '==', slug));
        const snap = await getDocs(q);
        const isTakenBySomeoneElse = snap.docs.some(d => d.id !== pageId);
        if (isTakenBySomeoneElse) {
          setSlugError('هذا الرابط مستخدم بالفعل. الرجاء اختيار رابط آخر.');
        }
      } catch (err) {
        console.error("Error checking slug:", err);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timeout = setTimeout(checkSlug, 800);
    return () => clearTimeout(timeout);
  }, [slug, initialLoading, pageId]);

  const safeSlug = slug || pageId || 'DEMO';
  const viewUrl = `${window.location.origin}/view/${safeSlug}`;

  const handlePublish = async () => {
    if (!pageId || slugError || isCheckingSlug || !slug) return;
    setPublishing(true);
    try {
      const docRef = doc(db, 'pages', pageId);
      await updateDoc(docRef, { isPublished: true, slug: slug });
      setPublished(true);
    } catch (err) {
      console.error("Error publishing:", err);
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (initialLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-electric" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4 mb-6">
        <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="text-electric" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-text-main">النشر والمشاركة</h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
          قم بنشر التحديثات الأخيرة لتصبح متاحة لطلابك. حدد الرابط المخصص لموقعك!
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-text-muted">تخصيص الرابط (Slug)</label>
        
        <div className={`flex bg-base border ${slugError ? 'border-red-500/50 focus-within:ring-red-500/20' : 'border-border-subtle focus-within:ring-electric focus-within:border-electric'} rounded-xl overflow-hidden focus-within:ring-2 transition-all`} dir="ltr">
          <div className="bg-surface px-4 py-3 flex items-center justify-center border-r border-border-subtle text-text-muted/60 font-mono text-xs sm:text-sm shrink-0 whitespace-nowrap">
            {window.location.host}/view/
          </div>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={slug}
              onChange={(e) => {
                setSlug(formatSlug(e.target.value));
                setPublished(false); // require republishing if slug changes
              }}
              className="w-full h-full bg-transparent px-3 py-3 font-mono text-text-main focus:outline-none"
              placeholder="math-10"
            />
            {isCheckingSlug && (
               <Loader2 className="absolute right-3 top-3.5 animate-spin text-text-muted" size={16} />
            )}
          </div>
          <button 
             onClick={() => {
                setSlug('p-' + Math.random().toString(36).substring(2, 8));
                setPublished(false);
             }}
             title="توليد استخراج عشوائي"
             className="px-4 py-3 bg-surface border-l border-border-subtle hover:bg-electric/10 text-electric transition-colors flex items-center justify-center shrink-0"
          >
             <Dices size={20} />
          </button>
        </div>

        {slugError && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
            <AlertCircle size={14} /> {slugError}
          </p>
        )}
      </div>

      {!published ? (
        <button 
          onClick={handlePublish}
          disabled={publishing || !!slugError || isCheckingSlug || !slug}
          className="w-full mt-4 py-4 bg-electric text-white font-bold rounded-xl shadow-lg hover:shadow-electric/25 hover:-translate-y-1 transition-all flex justify-center items-center gap-2 text-lg disabled:opacity-50 disabled:hover:-translate-y-0"
        >
          {publishing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} 
          {publishing ? 'جاري النشر...' : 'نشر التغييرات الآن'}
        </button>
      ) : (
        <div className="space-y-6 mt-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center space-y-3">
            <CheckCircle2 className="text-green-500 mx-auto" size={32} />
            <h3 className="text-green-500 font-bold text-lg">تم النشر بنجاح!</h3>
            <p className="text-sm text-green-500/80">موقعك الآن متاح لجميع الطلاب عبر الرابط المخصص.</p>
          </div>

          <div className="space-y-3">
            <div 
              onClick={copyLink}
              className="flex items-center justify-between p-4 bg-base border border-border-subtle rounded-xl cursor-pointer hover:border-electric transition-colors group"
            >
              <span className="text-text-main text-sm truncate font-mono" dir="ltr">{viewUrl}</span>
              {copied ? <CheckCircle2 className="text-green-500" size={20} /> : <Copy className="text-text-muted group-hover:text-electric" size={20} />}
            </div>
          </div>

          <a 
            href={viewUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-surface border border-border-subtle text-text-main font-bold rounded-xl hover:bg-base transition-all flex justify-center items-center gap-2"
          >
            <ExternalLink size={20} /> عرض الموقع المباشر
          </a>
        </div>
      )}
    </div>
  );
};
