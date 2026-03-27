import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserCircle, Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('يرجى كتابة بريدك الإلكتروني في الحقل أعلاه أولاً.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 8000);
    } catch (err: any) {
      console.error(err);
      setError('تعذر إرسال الرابط. تأكد من صحة البريد الإلكتروني أو كونه مسجلاً لدينا.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!username.trim()) {
           setError('يرجى إدخال اسم المستخدم.');
           setLoading(false);
           return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username.trim() });
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          username: username.trim(),
          email: userCredential.user.email,
          subscriptionStatus: 'free',
          limits: { maxPages: 1 },
          createdAt: serverTimestamp()
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      
      const errorCode = err.code;
      if (errorCode === 'auth/weak-password') {
        friendlyMessage = 'كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.';
      } else if (errorCode === 'auth/email-already-in-use') {
        friendlyMessage = 'هذا البريد الإلكتروني مسجل مسبقاً. الرجاء تسجيل الدخول.';
      } else if (errorCode === 'auth/invalid-email') {
        friendlyMessage = 'صيغة البريد الإلكتروني غير صحيحة.';
      } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        friendlyMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (errorCode === 'auth/network-request-failed') {
        friendlyMessage = 'لا يوجد اتصال بالإنترنت. تأكد من الشبكة وحاول مجدداً.';
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
      {/* Background Orbs - Sharper and more vibrant */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-electric/40 blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/30 blur-[80px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-md p-8 bg-surface/80 backdrop-blur-2xl rounded-3xl border border-border-subtle shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-electric/10 flex items-center justify-center mb-4 border border-electric/20">
            <UserCircle size={32} className="text-electric" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Teacher<span className="text-electric">Hub</span></h1>
          <p className="text-text-muted text-center">
            {isLogin ? 'سجل دخولك للوصول إلى لوحة التحكم وبناء دروسك.' : 'أنشئ حساباً جديداً للبدء في بناء دروسك التفاعلية.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm text-center animate-in fade-in slide-in-from-top-4">
            تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني! 📧
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-main">اسم المستخدم</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-muted">
                  <UserCircle size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-surface border border-border-subtle rounded-xl py-3 pr-11 pl-4 text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-electric transition-all"
                  placeholder="اسمك أو اللقب"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-muted">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-border-subtle rounded-xl py-3 pr-11 pl-4 text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-electric transition-all"
                placeholder="teacher@school.com"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-muted">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface border border-border-subtle rounded-xl py-3 pr-11 pl-4 text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-electric transition-all"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
            {isLogin && (
              <div className="flex justify-start mt-2 px-1">
                <button 
                  type="button" 
                  onClick={handleResetPassword}
                  className="text-xs text-text-muted hover:text-electric hover:underline transition-colors focus:outline-none"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-electric text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-electric/90 hover:shadow-lg hover:shadow-electric/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
                <ChevronRight size={18} className="group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-subtle text-center">
          <p className="text-text-muted text-sm">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-electric hover:underline font-medium"
            >
              {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
