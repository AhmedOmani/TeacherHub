import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Plus, LayoutTemplate, LogOut, ExternalLink, PenBox, Loader2, Trash2, Edit2, Check, X, Sparkles, Gem, Camera } from 'lucide-react';
import { defaultConfig } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';
import { FileUpload } from '../components/ui/FileUpload';

interface PageDoc {
  id: string;
  internalTitle: string;
  isPublished: boolean;
  createdAt: any;
  slug?: string;
}

interface UserLimits {
  subscriptionStatus: string;
  maxPages: number;
  globalAvatar?: string;
}

export function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // PRO Auth Limits
  const [userLimits, setUserLimits] = useState<UserLimits>({ subscriptionStatus: 'free', maxPages: 1 });
  const [showProModal, setShowProModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Fetch Limits
        const userDocRef = await getDoc(doc(db, 'users', user.uid));
        if (userDocRef.exists()) {
          const data = userDocRef.data() as any;
          setUserLimits({
            subscriptionStatus: data.subscriptionStatus || 'free',
            maxPages: data.limits?.maxPages || 1,
            globalAvatar: data.globalAvatar
          });
        }

        // Fetch Pages
        const q = query(collection(db, 'pages'), where('ownerUid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedPages: PageDoc[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPages.push({
            id: doc.id,
            internalTitle: data.internalTitle,
            isPublished: data.isPublished,
            createdAt: data.createdAt,
            slug: data.slug
          });
        });
        fetchedPages.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setPages(fetchedPages);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchData();
  }, [user]);

  const handleCreateNew = async () => {
    if (!user) return;

    // Check PRO Limit Block
    if (pages.length >= userLimits.maxPages && userLimits.subscriptionStatus === 'free') {
      setShowProModal(true);
      return;
    }

    setCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'pages'), {
        ownerUid: user.uid,
        internalTitle: 'موقع جديد',
        slug: user.uid.substring(0, 5) + '-' + Date.now(),
        isPublished: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        config: {
          ...defaultConfig,
          hero: {
            ...defaultConfig.hero,
            avatar: userLimits.globalAvatar || defaultConfig.hero.avatar
          }
        }
      });
      navigate(`/editor/${docRef.id}`);
    } catch (err) {
      console.error("Error creating new page", err);
      setCreating(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (userLimits.subscriptionStatus === 'free') {
      alert('عذراً، حذف المواقع لإنشاء مساحات جديدة غير متاح في الخطة المجانية لضمان استقرار روابط طلابك.\n\nيمكنك تعديل موقعك الحالي بدلاً من ذلك، أو الترقية لـ PRO للتمتع بمواقع غير محدودة!');
      setShowProModal(true);
      return;
    }

    if (!window.confirm('هل أنت متأكد من حذف هذا الموقع نهائياً؟')) return;
    setDeletingId(pageId);
    try {
      await deleteDoc(doc(db, 'pages', pageId));
      setPages(prev => prev.filter(p => p.id !== pageId));
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartRename = (pageId: string, currentTitle: string) => {
    setRenamingId(pageId);
    setRenameValue(currentTitle);
  };

  const handleSaveRename = async (pageId: string) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }

    setPages(prev => prev.map(p => p.id === pageId ? { ...p, internalTitle: renameValue } : p));
    setRenamingId(null);

    try {
      await updateDoc(doc(db, 'pages', pageId), { internalTitle: renameValue });
    } catch (err) {
      console.error("Error renaming:", err);
      alert('حدث خطأ أثناء تغيير الاسم. يرجى تحديث الصفحة.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="w-full h-screen bg-base flex flex-col items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-electric w-12 h-12 mb-4" />
        <p className="text-white/60">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-text-main relative overflow-hidden" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] sm:top-[-20%] right-[-10%] sm:right-[-5%] w-[50vw] sm:w-[30vw] h-[50vw] sm:h-[30vw] rounded-full bg-electric/30 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] sm:left-[-5%] w-[50vw] sm:w-[30vw] h-[50vw] sm:h-[30vw] rounded-full bg-purple-500/20 blur-[100px] pointer-events-none animate-pulse" />

      {/* Global Avatar Settings Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAvatarModal(false)} />
          <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-border-subtle shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-base/80">
              <h3 className="text-xl font-bold text-text-main flex items-center gap-3">
                <Camera className="text-electric" size={24} />
                الصورة الشخصية
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-text-muted mb-6">
                قم بتعيين صورة شخصية لك. هذه الصورة ستظهر تلقائياً كصورة رئيسية في أي <span className="text-electric font-bold">موقع جديد</span> تقوم بإنشائه مستقبلاً.
              </p>

              <FileUpload
                label="ارفع صورتك (مدعوم S3)"
                value={userLimits.globalAvatar || ''}
                accept="image/*"
                onChange={async (url) => {
                  if (!user) return;
                  // Optimistic update
                  setUserLimits(prev => ({ ...prev, globalAvatar: url }));
                  try {
                    await updateDoc(doc(db, 'users', user.uid), { globalAvatar: url });
                  } catch (e) {
                    console.error("Error saving global avatar", e);
                  }
                }}
              />

              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-full mt-4 py-3 bg-base border border-border-subtle hover:bg-surface text-text-main font-bold rounded-xl transition-colors"
              >
                إغلاق و حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRO Upgrade Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowProModal(false)} />
          <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.3)] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header Glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-500/40 to-transparent pointer-events-none" />

            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 left-4 sm:right-4 sm:left-auto p-2 bg-surface hover:bg-base border border-border-subtle rounded-full text-text-muted hover:text-text-main transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center relative z-10 pt-16">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-electric via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-6 transform -rotate-6 group hover:rotate-0 transition-all duration-500">
                <Gem className="text-white drop-shadow-lg" size={48} />
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-wide transform">ارتقِ بمنصتك <span className="text-transparent bg-clip-text bg-gradient-to-l from-pink-400 to-electric">PRO</span></h2>
              <p className="text-text-muted text-sm mb-8 leading-relaxed">
                لقد وصلت للحد الأقصى (صفحة واحدة) في الخطة المجانية. اشترك في TeacherHub PRO الآن وحلّق بإبداعك بلا حدود!
              </p>

              <div className="space-y-3 text-right mb-8">
                {[
                  'عدد غير محدود من الفصول الدراسية',
                  'إحصائيات متقدمة للطلاب عبر صفحتك',
                  'رفع ملفات وصور بجودة أعلى (قريباً)',
                  'أولوية الدعم الفني والحماية المتقدمة'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-white bg-slate-100/80 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                      <Check size={14} className="text-white absolute" strokeWidth={3} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => openWaitlist('Dashboard Pro Card')}
                className="w-full py-4 bg-electric text-white font-black rounded-xl shadow-xl hover:shadow-electric/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg flex justify-center items-center gap-2"
              >
                <Sparkles size={20} /> الترقية الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-border-subtle bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setShowAvatarModal(true)}
              className="w-10 h-10 rounded-xl outline-none bg-electric flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-electric/20 cursor-pointer overflow-hidden border-2 border-transparent hover:border-white/50 transition-all group relative"
              title="تغيير الصورة الشخصية"
            >
              {userLimits.globalAvatar ? (
                <img src={userLimits.globalAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                'TH'
              )}
              <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-main hidden sm:block">Teacher<span className="text-electric">Hub</span> <span className="text-xs text-electric px-2 py-0.5 border border-electric/30 bg-electric/10 rounded-full align-top ml-2">PRO</span></h1>
          </div>

          <div className="flex items-center gap-4">
            {userLimits.subscriptionStatus === 'pro' && (
              <div className="hidden sm:flex px-3 py-1 bg-gradient-to-r from-electric to-purple-500 rounded-full text-xs font-bold text-white items-center gap-1 shadow-lg shadow-purple-500/20">
                <Gem size={12} /> PRO
              </div>
            )}
            <ThemeToggle />
            <div className="w-px h-8 bg-border-subtle mx-2 hidden sm:block"></div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold truncate max-w-[150px]">{user?.displayName || 'مستخدم'}</p>
              <p className="text-xs text-text-muted">مساحة العمل الخاصة بك</p>
            </div>
            <button onClick={logout} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="تسجيل الخروج">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">مواقعي</h2>
            <p className="text-text-muted">قم بإدارة وتعديل و نشر فصولك الدراسية من هنا</p>
          </div>
          <button
            onClick={handleCreateNew}
            disabled={creating}
            className="bg-electric text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-electric/90 shadow-lg shadow-electric/25 transition-all w-full sm:w-auto justify-center disabled:opacity-50"
          >
            {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            إنشاء موقع جديد
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="w-full bg-surface border border-border-subtle rounded-3xl p-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 mb-6 bg-electric/10 rounded-full flex items-center justify-center border border-electric/20 text-electric">
              <LayoutTemplate size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">لا يوجد اي مواقع بعد</h3>
            <p className="text-text-muted max-w-md mx-auto mb-8">
              ابدأ بإنشاء أول مساحة عمل أو موقع تعليمي لطلابك بالنقر على زر إنشاء موقع جديد!
            </p>
            <button onClick={handleCreateNew} className="text-electric font-semibold hover:underline flex items-center gap-2">
              <Plus size={18} /> إنشاء أول موقع الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div key={page.id} className="bg-surface border border-border-subtle rounded-2xl p-6 hover:border-electric/50 hover:shadow-2xl hover:shadow-electric/5 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartRename(page.id, page.internalTitle)}
                      className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-electric hover:border-electric/50 transition-all"
                      title="تغيير الاسم"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      disabled={deletingId === page.id}
                      className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all disabled:opacity-50"
                      title="حذف الموقع"
                    >
                      {deletingId === page.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${page.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                    {page.isPublished ? 'نشط ومتاح' : 'مسودة'}
                  </div>
                </div>

                {renamingId === page.id ? (
                  <div className="flex items-center gap-2 mb-2" dir="rtl">
                    <input
                      autoFocus
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(page.id)}
                      className="flex-1 bg-base border border-electric rounded-lg px-3 py-1.5 text-lg font-bold text-text-main outline-none focus:ring-2 focus:ring-electric/30"
                      placeholder="اسم الموقع"
                    />
                    <button onClick={() => handleSaveRename(page.id)} className="text-green-500 hover:bg-green-500/20 p-2 rounded-lg transition-colors"><Check size={18} /></button>
                    <button onClick={() => setRenamingId(null)} className="text-red-400 hover:bg-red-400/20 p-2 rounded-lg transition-colors"><X size={18} /></button>
                  </div>
                ) : (
                  <h3 className="text-xl font-bold mb-2 group-hover:text-electric transition-colors truncate">{page.internalTitle}</h3>
                )}

                <p className="text-text-muted text-sm mb-8 flex-1">
                  تمت الإضافة: {page.createdAt?.toDate().toLocaleDateString('ar-EG') || 'حديثاً'}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
                  <button
                    onClick={() => navigate(`/editor/${page.id}`)}
                    className="flex-1 bg-electric/10 text-electric hover:bg-electric hover:text-white py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors text-sm"
                  >
                    <PenBox size={16} /> تعديل
                  </button>
                  {page.isPublished ? (
                    <a
                      href={`/view/${page.slug || page.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-base border border-border-subtle hover:border-electric text-text-main hover:text-electric py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors text-sm"
                    >
                      <ExternalLink size={16} /> عرض النشر
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate(`/editor/${page.id}`)}
                      className="flex-1 bg-base border border-border-subtle hover:border-electric text-text-main hover:text-electric py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors text-sm"
                    >
                      <PenBox size={16} /> استكمال النشر
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
