import React, { createContext, useContext, useState } from 'react';
import { X, Crown, Loader2, Check } from 'lucide-react';
import { useAuth } from './AuthContext';

interface WaitlistContextType {
  openWaitlist: (source: string) => void;
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

export const WaitlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceData, setSourceData] = useState<string>('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  const openWaitlist = (source: string) => {
    setSourceData(source);
    if (user?.email && !email) setEmail(user.email);
    setIsOpen(true);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      // Send directly to the provided email using FormSubmit's AJAX endpoint
      const response = await fetch("https://formsubmit.co/ajax/ahmedschwifty@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: "🚀 TeacherHub Pro Waitlist Lead!",
            email: email,
            source: sourceData,
            user_uid: user?.uid || 'anonymous'
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <WaitlistContext.Provider value={{ openWaitlist }}>
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-base/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-surface border border-border-subtle rounded-3xl shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-300" dir="rtl">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-electric/20 rounded-full blur-3xl pointer-events-none" />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-slate-900 dark:hover:text-white bg-base hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-electric/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-electric/30 shadow-inner">
                <Crown className="text-electric" size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">TeacherHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-pink-500">PRO</span></h2>
              <p className="text-text-muted text-sm leading-relaxed">
                هذه الميزة متاحة في النسخة الاحترافية (قريباً).
                <br />انضم لقائمة الانتظار الآن واحصل على <span className="text-electric font-bold">خصم 50%</span> عند الإطلاق!
              </p>
            </div>

            {status === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300 relative z-10">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                  <Check size={24} className="text-white" strokeWidth={3} />
                </div>
                <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400 mb-1">تم تسجيلك بنجاح! 🎉</h3>
                <p className="text-text-muted text-sm">سنقوم بمراسلتك فور إطلاق النسخة الاحترافية لحجز مقعدك.</p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-6 w-full py-3 bg-base hover:bg-slate-100 dark:hover:bg-white/5 border border-border-subtle text-slate-900 dark:text-white font-medium rounded-xl transition-all"
                >
                  العودة للمنصة
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="text-right">
                  <label className="block text-xs font-medium text-text-muted mb-1.5 ml-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    disabled={status === 'loading'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.com"
                    className="w-full bg-base border border-border-subtle focus:border-electric rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none transition-all placeholder:text-text-muted/50 disabled:opacity-50 text-right"
                  />
                </div>
                
                {status === 'error' && (
                  <p className="text-xs text-red-400 text-center bg-red-400/10 py-2 rounded-lg">حدث خطأ أثناء التسجيل. يُرجى المحاولة لاحقاً.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-electric to-purple-600 hover:from-purple-600 hover:to-electric text-white font-bold rounded-xl shadow-lg hover:shadow-electric/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>احجز مقعدك واحصل على الخصم</span>
                      <Crown size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </WaitlistContext.Provider>
  );
};

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);
  if (!context) throw new Error("useWaitlist must be used within WaitlistProvider");
  return context;
};
